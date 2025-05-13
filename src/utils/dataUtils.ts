
import { supabase } from '@/integrations/supabase/client';
import siteData from '../data/siteData.json';
import { SiteData } from '@/lib/supabase';

// Function to get all site data from Supabase
export const getSiteData = async (): Promise<SiteData> => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return siteData as SiteData; // Fallback to local data
    }
    
    if (!data || !data.content) {
      console.warn('No data found in Supabase, using local data');
      return siteData as SiteData;
    }
    
    return data.content as SiteData;
  } catch (error) {
    console.error('Failed to fetch site data:', error);
    return siteData as SiteData; // Fallback to local data
  }
};

// Function to update site data in Supabase
export const updateSiteData = async (newData: SiteData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ 
        content: newData,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error updating data in Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update site data:', error);
    return false;
  }
};

// Helper functions to get specific sections of data
export const getHeroData = () => {
  return siteData.hero;
};

export const getAboutData = () => {
  return siteData.about;
};

export const getGalleryData = () => {
  return siteData.gallery;
};

export const getCastData = () => {
  return siteData.cast;
};

export const getInfoData = () => {
  return siteData.info;
};

export const getContactData = () => {
  return siteData.contact;
};

export const getGeneralData = () => {
  return siteData.general;
};

export const getFooterData = () => {
  return siteData.footer;
};
