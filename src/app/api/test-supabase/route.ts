import { supabase } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic connection
    const { data: userData, error: userError } = await supabase.auth.getUser();

    // Test database access (this will fail if tables don't exist)
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('count')
      .limit(1);

    const connectionStatus = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing',
      connection: userError && userError.message !== 'Auth session missing!' ? '❌ Failed' : '✅ Working',
      database: articlesError ? '⚠️ Tables not created yet' : '✅ Ready',
      tables: articlesError ? null : 'Articles table accessible'
    };

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection test completed',
      details: connectionStatus
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}