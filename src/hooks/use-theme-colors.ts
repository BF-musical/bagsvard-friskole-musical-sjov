
import { useState, useEffect } from 'react';
import { getSiteData } from '@/utils/dataUtils';

interface ThemeColors {
  blue: string;
  orange: string;
  yellow: string;
  pink: string;
  light: string;
}

const defaultColors: ThemeColors = {
  blue: '#3A86FF',
  orange: '#FF8A00',
  yellow: '#FFC53A',
  pink: '#FF3A8C',
  light: '#F9F7F3'
};

export const useThemeColors = () => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const data = await getSiteData();
        // Check if we have custom colors in the JSON data
        if (data.musical) {
          setColors({
            blue: data.musical.blue || defaultColors.blue,
            orange: data.musical.orange || defaultColors.orange,
            yellow: data.musical.yellow || defaultColors.yellow,
            pink: data.musical.pink || defaultColors.pink,
            light: data.musical.light || defaultColors.light,
          });
        }
      } catch (error) {
        console.error('Failed to fetch theme colors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchColors();
  }, []);

  return { colors, isLoading };
};
