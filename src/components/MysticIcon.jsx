import React from 'react';

/**
 * MysticIcon - Custom SVG Icon Component for Cassiopeia
 * @param {string} name - Icon name (e.g., 'aries', 'fire')
 * @param {string} color - Stroke color
 * @param {string} size - size in px (default 24)
 * @param {boolean} glow - whether to apply the aura glow effect
 */
export default function MysticIcon({ name, color = 'currentColor', size = 24, glow = true, className = '' }) {
  const icons = {
    // Zodiacs
    'aries': (
      <path 
        d="M12 21C12 21 12 12 12 7M12 7C14 5 17 4 19 6C21 8 20 11 18 12M12 7C10 5 7 4 5 6C3 8 4 11 6 12" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'taurus': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="5" />
        <path d="M7 6C7 6 7 10 12 10C17 10 17 6 17 6" />
      </g>
    ),
    'gemini': (
      <path 
        d="M9 7V17M15 7V17M7 5C10 7 14 7 17 5M7 19C10 17 14 17 17 19" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'cancer': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="3" />
        <circle cx="15" cy="15" r="3" />
        <path d="M12 9C17 9 19 12 19 12M12 15C7 15 5 12 5 12" />
      </g>
    ),
    'leo': (
      <path 
        d="M8 14C6 14 5 12 5 10C5 7 8 7 8 10C8 12 10 15 14 15C18 15 19 13 19 10C19 6 15 6 15 10" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'virgo': (
      <path 
        d="M6 8V14C6 14 6 17 8 17C10 17 11 15 11 15V8V14C11 14 11 17 13 17C15 17 16 15 16 15V8V14C16 14 16 20 14 21C12 22 10 21 10 21" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'libra': (
      <path 
        d="M5 19H19M5 14C8 11 16 11 19 14M12 11C12 11 11 6 12 6C13 6 12 11 12 11" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'scorpio': (
      <path 
        d="M6 8V14C6 14 6 17 8 17C10 17 11 15 11 15V8V14C11 14 11 17 13 17C15 17 16 15 16 15V8V14C16 14 19 14 19 17M19 17L17 15M19 17L21 15" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'sagittarius': (
      <path 
        d="M7 17L19 5M19 5H14M19 5V10M9 10L14 15" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'capricorn': (
      <path 
        d="M7 8L10 14L13 8C13 8 16 13 19 13C21 13 21 10 19 8C17 6 14 10 14 10" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'aquarius': (
      <path 
        d="M5 10L8 7L11 10L14 7L17 10L20 7M5 16L8 13L11 16L14 13L17 16L20 13" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'pisces': (
      <path 
        d="M7 5C5 8 5 16 7 19M17 5C19 8 19 16 17 19M5 12H19" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    // Elements
    'fire': (
      <path 
        d="M12 2L15 7C17 10 18 12 18 15C18 18.3 15.3 21 12 21C8.7 21 6 18.3 6 15C6 12 7 10 9 7L12 2Z M12 14L10 17C10 18.1 10.9 19 12 19C13.1 19 14 18.1 14 17L12 14Z" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'water': (
      <path 
        d="M12 21L9 16C7 13 6 11 6 8C6 4.7 8.7 2 12 2C15.3 2 18 4.7 18 8C18 11 17 13 15 16L12 21Z M12 9C12 9 11 10 10 10C9 10 8 9 8 8C8 7 9 6 10 6" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'earth': (
      <path 
        d="M12 22V14M12 14C15 14 18 12 18 8C18 4 14 2 12 2C10 2 6 4 6 8C6 12 9 14 12 14ZM8 8H16" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'air': (
      <path 
        d="M5 8H19M5 12H16M5 16H13M18 12C20 12 21 13 21 14C21 15 20 16 18 16M15 16C17 16 18 17 18 18C18 19 17 20 15 20" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    // UI Icons
    'coffee': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Steam Swirls */}
        <path d="M10 5C10 5 9 3 10 2" opacity="0.6" />
        <path d="M13 5C13 5 12 2 13 1" opacity="0.4" />
        <path d="M7 5C7 5 6 4 7 3" opacity="0.4" />
        {/* Cup Body */}
        <path d="M5 9H15C17 9 18 10 18 12V13C18 15 17 16 15 16H5C3 16 2 15 2 13V12C2 10 3 9 5 9Z" />
        {/* Handle */}
        <path d="M18 11H20C21.1 11 22 11.9 22 13C22 14.1 21.1 15 20 15H18" />
        {/* Saucer */}
        <path d="M3 19H17" opacity="0.7" />
        {/* Symbol on Cup */}
        <path d="M10 12C10 12 9.5 13.5 10 14" opacity="0.5" strokeWidth="1" />
      </g>
    ),
    'eye': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </g>
    ),
    'tarot': (
      <path 
        d="M7 4H17C18 4 19 5 19 6V18C19 18 18 20 17 20H7C6 20 5 18 5 18V6C5 5 6 4 7 4ZM9 7H15M9 10H15M12 13V17M10 15H14" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'cards_fan': (
      <g strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="10" height="14" rx="1.5" transform="rotate(-15 9 13)" opacity="0.5" />
        <rect x="10" y="6" width="10" height="14" rx="1.5" transform="rotate(15 15 13)" opacity="0.5" />
        <rect x="7" y="4" width="10" height="14" rx="1.5" />
        <path d="M10 9H14M10 12H14" opacity="0.6" />
      </g>
    ),
    'oracle_card': (
      <g strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M14 10C14 10 13 8 11 8C9 8 8 10 8 12C8 14 9 16 11 16C13 16 14 14 14 14" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 7V8M12 16V17M7 12H8M16 12H17" opacity="0.5" />
      </g>
    ),
    'mystic_flame': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C12 2 17 6 17 11C17 14 14.8 16.5 12 16.5C9.2 16.5 7 14 7 11C7 6 12 2 12 2Z" />
        <path d="M12 13C12 13 10.5 11 10.5 9.5C10.5 8.7 11.2 8 12 8C12.8 8 13.5 8.7 13.5 9.5C13.5 11 12 13 12 13Z" opacity="0.6" />
        <path d="M8 20H16" opacity="0.4" strokeWidth="1" />
      </g>
    ),
    'mystic_hands': (
      <g strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="3" width="8" height="13" rx="1.5" />
        <path d="M6 18C6 18 7 16 9 16H15C17 16 18 18 18 18C19 20 18 22 18 22H6C6 22 5 20 6 18Z" opacity="0.7" />
        <path d="M10 7H14M10 10H14" opacity="0.5" />
      </g>
    ),
    'edit': (
      <path 
        d="M11 4H4V20H20V13M18.5 2.5C19.3 1.7 20.7 1.7 21.5 2.5C22.3 3.3 22.3 4.7 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'delete': (
      <path 
        d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6M10 11V17M14 11V17" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'key': (
      <path 
        d="M7 11C7 11 7 11 7 11M7 11C5 11 3 13 3 15C3 17 5 19 7 19C9 19 11 17 11 15C11 15 11 11 11 11H21V15M17 11V13M14 11V13M7 14V16" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'person_add': (
      <path 
        d="M16 21V19C16 17.9 15.1 17 14 17H5C3.9 17 3 17.9 3 19V21M9.5 13C11.4 13 13 11.4 13 9.5C13 7.6 11.4 6 9.5 6C7.6 6 6 7.6 6 9.5C6 11.4 7.6 13 9.5 13ZM19 8V14M16 11H22" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'settings': (
      <path 
        d="M12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15ZM19.4 15L21.7 16.3L20.2 18.8L17.7 18.1C17.2 18.5 16.7 18.8 16.1 19L15.4 21.6H12.4L11.7 19C11.1 18.8 10.6 18.5 10.1 18.1L7.6 18.8L6.1 16.3L8.4 15C8.3 14 8.3 13 8.4 12L6.1 10.7L7.6 8.2L10.1 8.9C10.6 8.5 11.1 8.2 11.7 8L12.4 5.4H15.4L16.1 8C16.7 8.2 17.2 8.5 17.7 8.9L20.2 8.2L21.7 10.7L19.4 12C19.5 13 19.5 14 19.4 15Z" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'restart': (
      <path 
        d="M21.5 7C20.5 5 18.7 3.5 16.5 2.5C14.3 1.5 11.8 1.5 9.5 2.5C7.2 3.5 5.4 5 4.5 7M2 11C2 11 2 11 2 11V6M4 11H9C9 11 9 11 9 11M22 13V18M20 13H15M2.5 17C3.5 19 5.3 20.5 7.5 21.5C9.7 22.5 12.2 22.5 14.5 21.5C16.8 20.5 18.6 19 19.5 17" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'bolt': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Main Vertical & Horizontal (Perfect Symmetry) */}
        <path d="M12 2V22M2 12H22" />
        {/* Diagonal Flares (Shortened for hierarchy) */}
        <path d="M7 7L17 17M17 7L7 17" opacity="0.6" strokeWidth="1.2" />
      </g>
    ),
    'numbers': (
      <path 
        d="M4 9H20M4 15H20M10 3L8 21M16 3L14 21" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'arrow': (
      <path 
        d="M5 12H19M19 12L13 6M19 12L13 18" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'female': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M12 15V22M9 19H15" />
      </g>
    ),
    'male': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="15" r="6" />
        <path d="M14 10L20 4M20 4H15M20 4V9" />
      </g>
    ),
    'nonbinary': (
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="6" />
        <path d="M12 6V2M12 22V18M18 12H22M2 12H6M16.2 7.8L19 5M5 19L7.8 16.2M16.2 16.2L19 19M5 5L7.8 7.8" />
      </g>
    ),
    'add': (
      <path 
        d="M12 5V19M5 12H19" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'remove': (
      <path 
        d="M5 12H19" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    'chevron_left': (
      <path 
        d="M15 18L9 12L15 6" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    ),
    // Fallback: Stars
    'default': (
      <path 
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    )
  };

  const iconPath = icons[name] || icons['default'];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      className={`mystic-icon ${className}`}
      style={{
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'inline-block',
        verticalAlign: 'middle',
        opacity: 1,
        filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))'
      }}
    >
      {iconPath}
    </svg>
  );
}
