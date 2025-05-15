
import { supabase } from '@/integrations/supabase/client';
import siteData from '@/data/siteData.json';

export const initializeSupabaseData = async () => {
  try {
    console.log('Starting database initialization...');
    
    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('site_content')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return { 
        success: false, 
        message: `Error checking existing data: ${checkError.message}` 
      };
    }
    
    if (existingData && existingData.length > 0) {
      console.log('Data already exists. No initialization needed.');
      return { 
        success: true, 
        message: 'Database already contains site data. No initialization needed.' 
      };
    }
    
    // Insert initial data
    console.log('Data not found. Adding initial data...');
    const { error: insertError } = await supabase
      .from('site_content')
      .insert({ 
        content: siteData
      });
      
    if (insertError) {
      console.error('Error inserting initial data:', insertError);
      return { 
        success: false, 
        message: `Error initializing database: ${insertError.message}` 
      };
    }
    
    console.log('Database initialized successfully!');
    return { 
      success: true, 
      message: 'Database initialized successfully with initial site data!' 
    };
  } catch (error) {
    console.error('Unexpected error during initialization:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { 
      success: false, 
      message: `Unexpected error: ${errorMsg}` 
    };
  }
};
