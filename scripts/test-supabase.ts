import { supabase } from '../src/utils/supabase/client';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test connection by trying to get the current user
    const { data, error } = await supabase.auth.getUser();

    if (error && error.message !== 'Auth session missing!') {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    // Test if we can access the database
    const { data: testData, error: testError } = await supabase
      .from('articles')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('⚠️  Database tables not set up yet. Please run the SQL schema in your Supabase dashboard.');
      console.log('📄 SQL file location: supabase-schema.sql');
    } else {
      console.log('✅ Database tables are accessible!');
    }

    return true;

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testSupabaseConnection().then(() => {
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the contents of supabase-schema.sql');
    console.log('4. Test your app with real Supabase data!');
  });
}

export { testSupabaseConnection };