
import { supabase } from '@/integrations/supabase/client';
import siteData from '../data/siteData.json';
import type { SiteData } from '@/lib/supabase';

// Function to get all site data from Supabase
export const getSiteData = async (): Promise<SiteData> => {
  try {
    console.log('Fetching site data from Supabase...');
    
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      console.log('Falling back to local data');
      return siteData as SiteData; // Fallback to local data
    }
    
    if (!data || data.length === 0) {
      console.warn('No data found in Supabase, using local data');
      return siteData as SiteData;
    }
    
    console.log('Successfully fetched data from Supabase');
    return data[0].content as SiteData;
  } catch (error) {
    console.error('Failed to fetch site data:', error);
    console.log('Falling back to local data due to error');
    return siteData as SiteData; // Fallback to local data
  }
};

// Function to update site data in Supabase
export const updateSiteData = async (newData: SiteData): Promise<boolean> => {
  try {
    console.log('Updating site data in Supabase...');
    
    // Check if data exists first
    const { data: existingData, error: checkError } = await supabase
      .from('site_content')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return false;
    }
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { error } = await supabase
        .from('site_content')
        .update({ content: newData })
        .eq('id', existingData[0].id);
        
      if (error) {
        console.error('Error updating data in Supabase:', error);
        return false;
      }
      
      console.log('Data updated successfully');
    } else {
      // Insert new record
      const { error } = await supabase
        .from('site_content')
        .insert({ content: newData });
        
      if (error) {
        console.error('Error inserting data in Supabase:', error);
        return false;
      }
      
      console.log('Data inserted successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update site data:', error);
    return false;
  }
};

// Helper functions to get specific sections of data
export const getHeroData = async () => {
  const data = await getSiteData();
  return data.hero;
};

export const getAboutData = async () => {
  const data = await getSiteData();
  return data.about;
};

export const getGalleryData = async () => {
  const data = await getSiteData();
  return data.gallery;
};

export const getCastData = async () => {
  const data = await getSiteData();
  return data.cast;
};

export const getInfoData = async () => {
  const data = await getSiteData();
  return data.info;
};

export const getContactData = async () => {
  const data = await getSiteData();
  return data.contact;
};

export const getGeneralData = async () => {
  const data = await getSiteData();
  return data.general;
};

export const getFooterData = async () => {
  const data = await getSiteData();
  return data.footer;
};
