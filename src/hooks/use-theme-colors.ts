
import { useState, useEffect } from 'react';
import { getSiteData } from '@/utils/dataUtils';

// Default colors if not provided in the site data
const DEFAULT_COLORS = {
  blue: '#3A86FF',
  orange: '#FF8A00',
  yellow: '#FFC53A',
  pink: '#FF3A8C',
  light: '#F9F7F3',
};

/**
 * Hook to get theme colors from site data
 * @returns Object containing theme colors
 */
export const useThemeColors = () => {
  const [colors, setColors] = useState({
    blue: DEFAULT_COLORS.blue,
    orange: DEFAULT_COLORS.orange,
    yellow: DEFAULT_COLORS.yellow,
    pink: DEFAULT_COLORS.pink,
    light: DEFAULT_COLORS.light,
  });
  
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const data = await getSiteData();
        
        // Check if musical colors exist in the site data
        if (data.musical) {
          setColors({
            blue: data.musical.blue || DEFAULT_COLORS.blue,
            orange: data.musical.orange || DEFAULT_COLORS.orange,
            yellow: data.musical.yellow || DEFAULT_COLORS.yellow,
            pink: data.musical.pink || DEFAULT_COLORS.pink,
            light: data.musical.light || DEFAULT_COLORS.light,
          });
        }
      } catch (error) {
        console.error('Error fetching theme colors:', error);
        // Fallback to default colors on error
      }
    };
    
    fetchColors();
  }, []);
  
  return colors;
};
