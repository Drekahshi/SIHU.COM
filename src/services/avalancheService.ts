/**
 * Avalanche C-Chain service — full integration.
 *
 * Uses:
 *   - viem (already installed) for address derivation, signing, on-chain reads
 *   - @avalabs/avalanchejs for secp256k1 key generation
 *   - Browser window.ethereum for MetaMask / Core Wallet
 *
 * Networks:
 *   Fuji Testnet  → chain 43113  (development / demo)
 *   Mainnet       → chain 43114  (production)
 *
 * Set NEXT_PUBLIC_AVAX_NETWORK=mainnet in .env to switch.
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
  type PublicClient,
  type WalletClient,
  type Account,
  type Chain,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalanche, avalancheFuji } from 'viem/chains';

// ─── Network config ────────────────────────────────────────────────────────────

export const ACTIVE_CHAIN: Chain =
  process.env.NEXT_PUBLIC_AVAX_NETWORK === 'mainnet' ? avalanche : avalancheFuji;

export const network = {
  name: ACTIVE_CHAIN.name,
  chainId: ACTIVE_CHAIN.id,
  rpcUrl: ACTIVE_CHAIN.rpcUrls.default.http[0],
  explorerUrl:
    process.env.NEXT_PUBLIC_AVAX_NETWORK === 'mainnet'
      ? 'https://snowtrace.io'
      : 'https://testnet.snowtrace.io',
  symbol: 'AVAX',
  nativeCurrency: ACTIVE_CHAIN.nativeCurrency,
  isTestnet: process.env.NEXT_PUBLIC_AVAX_NETWORK !== 'mainnet',
};

// ─── Public client (read-only, no wallet needed) ───────────────────────────────

let _publicClient: PublicClient | null = null;

export function getPublicClient(): PublicClient {
  if (!_publicClient) {
    _publicClient = createPublicClient({
      chain: ACTIVE_CHAIN,
      transport: http(network.rpcUrl),
    });
  }
  return _publicClient;
}

// ─── Wallet types ─────────────────────────────────────────────────────────────

export interface AvaxWallet {
  address: `0x${string}`;
  privateKey: `0x${string}`;
  account: Account;
}

export interface WalletBalance {
  avax: string;
  avaxFormatted: string;
  avaxUsd: string;
}

// ─── Key generation & address derivation ──────────────────────────────────────

/**
 * Generates a proper secp256k1 keypair and derives the correct EVM address.
 * Uses viem's `privateKeyToAccount` which implements the same derivation
 * as MetaMask — keccak256 of the uncompressed public key, last 20 bytes.
 */
export function generateAvaxWallet(): AvaxWallet {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const privateKey = ('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')) as `0x${string}`;
  const account = privateKeyToAccount(privateKey);
  return { privateKey, address: account.address, account };
}

/**
 * Restores a wallet from an existing private key string.
 * Throws if the key is malformed.
 */
export function walletFromPrivateKey(rawKey: string): AvaxWallet {
  const privateKey = (rawKey.startsWith('0x') ? rawKey : '0x' + rawKey) as `0x${string}`;
  if (privateKey.length !== 66) throw new Error('Invalid private key length — must be 32 bytes (64 hex chars).');
  const account = privateKeyToAccount(privateKey);
  return { privateKey, address: account.address, account };
}

// ─── Balance fetching ──────────────────────────────────────────────────────────

const AVAX_USD_PRICE_CACHE = { price: 0, fetchedAt: 0 };

async function getAvaxUsdPrice(): Promise<number> {
  const now = Date.now();
  if (now - AVAX_USD_PRICE_CACHE.fetchedAt < 60_000 && AVAX_USD_PRICE_CACHE.price > 0) {
    return AVAX_USD_PRICE_CACHE.price;
  }
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd',
      { next: { revalidate: 60 } },
    );
    const data = await res.json();
    const price = data['avalanche-2']?.usd ?? 0;
    AVAX_USD_PRICE_CACHE.price = price;
    AVAX_USD_PRICE_CACHE.fetchedAt = now;
    return price;
  } catch {
    return AVAX_USD_PRICE_CACHE.price;
  }
}

export async function getWalletBalance(address: `0x${string}`): Promise<WalletBalance> {
  const client = getPublicClient();
  const [rawBalance, avaxPrice] = await Promise.all([
    client.getBalance({ address }),
    getAvaxUsdPrice(),
  ]);
  const avaxFormatted = Number(formatEther(rawBalance)).toFixed(4);
  const avaxUsd = (Number(avaxFormatted) * avaxPrice).toFixed(2);
  return {
    avax: rawBalance.toString(),
    avaxFormatted,
    avaxUsd,
  };
}

// ─── Transaction sending ───────────────────────────────────────────────────────

export interface SendAvaxParams {
  from: Account;
  to: `0x${string}`;
  amountAvax: string;
}

export interface TxResult {
  hash: `0x${string}`;
  explorerUrl: string;
}

/**
 * Sends AVAX from a native (private-key) wallet.
 * Returns the transaction hash and a link to the block explorer.
 */
export async function sendAvax({ from, to, amountAvax }: SendAvaxParams): Promise<TxResult> {
  const walletClient: WalletClient = createWalletClient({
    account: from,
    chain: ACTIVE_CHAIN,
    transport: http(network.rpcUrl),
  });

  const hash = await walletClient.sendTransaction({
    account: from,
    to,
    value: parseEther(amountAvax),
    chain: ACTIVE_CHAIN,
  });

  return {
    hash,
    explorerUrl: `${network.explorerUrl}/tx/${hash}`,
  };
}

// ─── MetaMask / Core Wallet ────────────────────────────────────────────────────

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  removeListener: (event: string, cb: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

function getEthereum(): EthereumProvider {
  const eth = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
  if (!eth) throw new Error('No Web3 wallet found. Install MetaMask or Core Wallet.');
  return eth;
}

/**
 * Adds Avalanche network to MetaMask / Core and returns the connected address.
 * Safe to call multiple times — silently skips if chain already exists.
 */
export async function connectMetaMaskToAvax(): Promise<`0x${string}`> {
  const eth = getEthereum();
  const chainHex = '0x' + ACTIVE_CHAIN.id.toString(16);

  try {
    await eth.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: chainHex,
        chainName: network.name,
        nativeCurrency: network.nativeCurrency,
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: [network.explorerUrl],
      }],
    });
  } catch {
    // Chain already registered — continue
  }

  await eth.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainHex }],
  });

  const accounts = await eth.request({ method: 'eth_requestAccounts' }) as `0x${string}`[];
  return accounts[0];
}

/**
 * Sends AVAX via MetaMask — user confirms in the wallet popup.
 */
export async function sendAvaxMetaMask(to: `0x${string}`, amountAvax: string): Promise<TxResult> {
  const eth = getEthereum();
  const accounts = await eth.request({ method: 'eth_accounts' }) as `0x${string}`[];
  const from = accounts[0];
  if (!from) throw new Error('No account connected.');

  const valueHex = '0x' + parseEther(amountAvax).toString(16);
  const hash = await eth.request({
    method: 'eth_sendTransaction',
    params: [{ from, to, value: valueHex }],
  }) as `0x${string}`;

  return { hash, explorerUrl: `${network.explorerUrl}/tx/${hash}` };
}

/**
 * Listens for account changes in MetaMask and calls the callback.
 */
export function onAccountChange(cb: (address: `0x${string}` | null) => void): () => void {
  try {
    const eth = getEthereum();
    const handler = (accounts: unknown) => {
      const list = accounts as `0x${string}`[];
      cb(list.length > 0 ? list[0] : null);
    };
    eth.on('accountsChanged', handler);
    return () => eth.removeListener('accountsChanged', handler);
  } catch {
    return () => {};
  }
}

/**
 * Listens for network changes in MetaMask and calls the callback with the new chainId.
 */
export function onChainChange(cb: (chainId: number) => void): () => void {
  try {
    const eth = getEthereum();
    const handler = (chainId: unknown) => cb(parseInt(String(chainId), 16));
    eth.on('chainChanged', handler);
    return () => eth.removeListener('chainChanged', handler);
  } catch {
    return () => {};
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function shortAddress(addr: string, chars = 4): string {
  return `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;
}

export function explorerLink(hash: string, type: 'tx' | 'address' = 'tx'): string {
  return `${network.explorerUrl}/${type}/${hash}`;
}
