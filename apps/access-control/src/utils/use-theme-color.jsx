import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to manage theme color settings based on localStorage.
 *
 * @returns {Object} An object containing color, textColor, themeColor, setThemeColor, isDarkMode, and toggleDarkMode.
 */
export const useThemeColor = () => {
  const [color, setColor] = useState();
  const [textColor, setTextColor] = useState();
  const [themeColor, setThemeColor] = useState(() => {
    const storedSettings = localStorage.getItem('app-settings');
    return storedSettings ? JSON.parse(storedSettings).primaryColor : 'default';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('theme-mode');
    return storedMode === 'dark';
  });

  const colorRef = useRef();
  colorRef.current = color;

  useEffect(() => {
    /**
     * Override localStorage.setItem to dispatch custom events on changes.
     *
     * @param {string} key - The key of the item to set.
     * @param {string} value - The value of the item to set.
     */
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      const event = new Event('localStorageChange');
      event.key = key;
      event.value = value;
      window.dispatchEvent(event);
      originalSetItem.apply(this, arguments);
    };

    /**
     * Handle custom storage change events.
     *
     * @param {Event} event - The custom event with key and value.
     */
    const handleCustomChange = (event) => {
      if (event.key === 'app-settings') {
        const newSettings = JSON.parse(event.value);
        setThemeColor(newSettings.primaryColor || 'default');
      } else if (event.key === 'theme-mode') {
        setIsDarkMode(event.value === 'dark');
      }
    };

    window.addEventListener('localStorageChange', handleCustomChange);

    return () => {
      localStorage.setItem = originalSetItem; // Restore original
      window.removeEventListener('localStorageChange', handleCustomChange);
    };
  }, []);

  useEffect(() => {
    const backgroundColor = isDarkMode ? '#1a1a1a' : getLightModeColor(themeColor);
    setColor(backgroundColor);
    setTextColor(getTextColor(themeColor));
  }, [themeColor, isDarkMode]);

  /**
   * Toggle between dark and light mode.
   */
  const toggleDarkMode = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    localStorage.setItem('theme-mode', newMode);
    setIsDarkMode(!isDarkMode);
  };

  /**
   * Get the background color for light mode based on the theme color.
   *
   * @param {string} themeColor - The selected theme color.
   * @returns {string} The background color.
   */
  const getLightModeColor = (themeColors) => {
    switch (themeColors) {
      case 'default':
        return '#ebf8f4';
      case 'preset1':
        return '#ecf6fe';
      case 'preset2':
        return '#f4effc';
      case 'preset3':
        return '#ecf3fd';
      case 'preset4':
        return '#fff8ef';
      case 'preset5':
        return '#ffefef';
      default:
        return '#ebf8f4';
    }
  };

  /**
   * Get the text color based on the theme color.
   *
   * @param {string} themeColor - The selected theme color.
   * @returns {string} The text color.
   */
  const getTextColor = (themeColors) => {
    switch (themeColors) {
      case 'default':
        return '#02a870';
      case 'preset1':
        return '#1e98f0';
      case 'preset2':
        return '#854ce0';
      case 'preset3':
        return '#0c68e9';
      case 'preset4':
        return '#fdac35';
      case 'preset5':
        return '#ff3232';
      default:
        return '#02a870';
    }
  };

  return { color, textColor, themeColor, setThemeColor, isDarkMode, toggleDarkMode };
};
