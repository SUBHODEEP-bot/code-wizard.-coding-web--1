
import React from 'react';

export const ChatbotIcon = ({ className = "", size = 150 }: { className?: string; size?: number }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 150 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Antenna */}
      <line x1="75" y1="15" x2="75" y2="25" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="75" cy="12" r="3" fill="#3B82F6"/>
      
      {/* Head */}
      <rect x="55" y="25" width="40" height="35" rx="20" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
      
      {/* Face Screen */}
      <rect x="60" y="30" width="30" height="20" rx="8" fill="#1F2937"/>
      
      {/* Eyes */}
      <circle cx="67" cy="38" r="3" fill="#3B82F6"/>
      <circle cx="83" cy="38" r="3" fill="#3B82F6"/>
      
      {/* Smile */}
      <path d="M 68 44 Q 75 47 82 44" stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      
      {/* Body */}
      <rect x="60" y="60" width="30" height="40" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
      
      {/* HI! Text Box */}
      <rect x="65" y="70" width="20" height="12" rx="6" fill="#3B82F6"/>
      <text x="75" y="78" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="Arial, sans-serif">HI!</text>
      
      {/* Right Arm (Waving) */}
      <rect x="90" y="65" width="12" height="4" rx="2" fill="#3B82F6"/>
      <rect x="102" y="60" width="4" height="12" rx="2" fill="#3B82F6"/>
      <circle cx="104" cy="58" r="3" fill="#3B82F6"/>
      
      {/* Left Arm (Down) */}
      <rect x="48" y="65" width="12" height="4" rx="2" fill="#3B82F6"/>
      <rect x="44" y="69" width="4" height="12" rx="2" fill="#3B82F6"/>
      <circle cx="46" cy="83" r="3" fill="#3B82F6"/>
      
      {/* Legs */}
      <rect x="65" y="100" width="6" height="20" rx="3" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="79" y="100" width="6" height="20" rx="3" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      
      {/* Feet */}
      <ellipse cx="68" cy="125" rx="8" ry="4" fill="#3B82F6"/>
      <ellipse cx="82" cy="125" rx="8" ry="4" fill="#3B82F6"/>
      
      {/* Body highlights */}
      <rect x="62" y="62" width="2" height="8" rx="1" fill="#3B82F6" opacity="0.3"/>
      <rect x="86" y="62" width="2" height="8" rx="1" fill="#3B82F6" opacity="0.3"/>
    </svg>
  );
};
