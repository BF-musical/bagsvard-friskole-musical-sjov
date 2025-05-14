
import { supabase } from '@/integrations/supabase/client';
import siteData from '../data/siteData.json';

/**
 * Initialize the Supabase database with the default site data
 * This function can be called from the Admin page or during initial setup
 */
export const initializeSupabaseData = async () => {
  try {
    console.log('Starting database initialization...');
    
    // Check if data already exists
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error checking for existing data:', error);
      return { success: false, message: 'Failed to check for existing data: ' + error.message };
    }
    
    // If no data exists, insert the default data
    if (!data || data.length === 0) {
      console.log('No existing data found, inserting default data...');
      
      const { error: insertError } = await supabase
        .from('site_content')
        .insert({
          content: siteData,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error inserting initial data:', insertError);
        return { success: false, message: 'Failed to insert initial data: ' + insertError.message };
      }
      
      console.log('Initial data inserted successfully');
      return { success: true, message: 'Initial data inserted successfully' };
    }
    
    console.log('Data already exists, no initialization needed');
    return { success: true, message: 'Data already exists, no initialization needed' };
  } catch (error) {
    console.error('Failed to initialize data:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)) };
  }
};
