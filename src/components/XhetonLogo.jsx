export default function XhetonLogo({ className = "w-12 h-12", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="xheton-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Futuristic X with depth */}
      <g fill="url(#xheton-gradient)" stroke="none">
        {/* Left diagonal */}
        <path d="M 15 15 L 45 50 L 15 85 L 25 85 L 50 55 L 75 85 L 85 85 L 55 50 L 85 15 L 75 15 L 50 45 L 25 15 Z" 
              opacity="0.9"/>
        
        {/* Accent lines for futuristic effect */}
        <circle cx="50" cy="50" r="6" fill="#10b981" opacity="0.8"/>
        
        {/* Corner accents */}
        <rect x="12" y="12" width="4" height="12" rx="2" fill="#059669" opacity="0.6"/>
        <rect x="12" y="12" width="12" height="4" rx="2" fill="#059669" opacity="0.6"/>
        
        <rect x="84" y="12" width="4" height="12" rx="2" fill="#059669" opacity="0.6"/>
        <rect x="76" y="12" width="12" height="4" rx="2" fill="#059669" opacity="0.6"/>
        
        <rect x="12" y="76" width="4" height="12" rx="2" fill="#059669" opacity="0.6"/>
        <rect x="12" y="84" width="12" height="4" rx="2" fill="#059669" opacity="0.6"/>
        
        <rect x="84" y="76" width="4" height="12" rx="2" fill="#059669" opacity="0.6"/>
        <rect x="76" y="84" width="12" height="4" rx="2" fill="#059669" opacity="0.6"/>
      </g>
    </svg>
  );
}
