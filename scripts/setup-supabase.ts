import { supabase } from '../src/utils/supabase/client';

async function setupSupabaseTables() {
  console.log('Setting up Supabase tables...');

  try {
    // Create articles table
    const { error: articlesError } = await supabase.rpc('create_articles_table', {});
    if (articlesError && !articlesError.message.includes('already exists')) {
      console.error('Error creating articles table:', articlesError);
    } else {
      console.log('✅ Articles table ready');
    }

    // Create podcasts table
    const { error: podcastsError } = await supabase.rpc('create_podcasts_table', {});
    if (podcastsError && !podcastsError.message.includes('already exists')) {
      console.error('Error creating podcasts table:', podcastsError);
    } else {
      console.log('✅ Podcasts table ready');
    }

    // Create events table
    const { error: eventsError } = await supabase.rpc('create_events_table', {});
    if (eventsError && !eventsError.message.includes('already exists')) {
      console.error('Error creating events table:', eventsError);
    } else {
      console.log('✅ Events table ready');
    }

    // Create profiles table
    const { error: profilesError } = await supabase.rpc('create_profiles_table', {});
    if (profilesError && !profilesError.message.includes('already exists')) {
      console.error('Error creating profiles table:', profilesError);
    } else {
      console.log('✅ Profiles table ready');
    }

    console.log('🎉 Supabase setup complete!');
    console.log('You can now use Supabase for data storage.');

  } catch (error) {
    console.error('Setup failed:', error);
    console.log('Please run the SQL commands manually in your Supabase dashboard.');
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupSupabaseTables();
}

export { setupSupabaseTables };