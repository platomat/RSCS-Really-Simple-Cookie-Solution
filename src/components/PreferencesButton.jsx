import { useState, useEffect } from 'preact/hooks';
import { getCookiePreferences } from '../utils/cookieManager';

const PreferencesButton = ({ id, onClick, color }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const preferences = getCookiePreferences();
    setShowButton(!!preferences || CookieBannerWidget.showPreferencesButton);
  }, []);

  if (!showButton) return null;

  const buttonStyle = {
    backgroundColor: color,
  };

  return (
    <button
      className="preferences-button"
      id={id}
      style={buttonStyle}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label="Cookie preferences"
    >
      <span className="visually-hidden">Cookie preferences</span>
    </button>
  );
};

export default PreferencesButton;