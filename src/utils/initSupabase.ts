
import { supabase } from '@/integrations/supabase/client';
import siteData from '../data/siteData.json';

/**
 * Initialize the Supabase database with the default site data
 * This function can be called from the Admin page or during initial setup
 */
export const initializeSupabaseData = async () => {
  try {
    // Check if data already exists
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error checking for existing data:', error);
      return { success: false, message: 'Failed to check for existing data' };
    }
    
    // If no data exists, insert the default data
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('site_content')
        .insert({
          content: siteData,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error inserting initial data:', insertError);
        return { success: false, message: 'Failed to insert initial data' };
      }
      
      return { success: true, message: 'Initial data inserted successfully' };
    }
    
    return { success: true, message: 'Data already exists, no initialization needed' };
  } catch (error) {
    console.error('Failed to initialize data:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
