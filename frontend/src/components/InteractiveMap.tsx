import React, { useState } from 'react';
import { 
  Layers, 
  Navigation, 
  Pencil, 
  RotateCcw, 
  Plus, 
  Minus, 
  Sparkles, 
  MapPin, 
  Train, 
  ShieldCheck, 
  Star,
  Compass
} from 'lucide-react';
import { Property } from '../types';

interface InteractiveMapProps {
  properties: Property[];
  hoveredPropertyId: string | null;
  selectedPropertyId: string | null;
  onSelectProperty: (property: Property) => void;
  onHoverProperty: (id: string | null) => void;
  onSearchThisArea: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  hoveredPropertyId,
  selectedPropertyId,
  onSelectProperty,
  onHoverProperty,
  onSearchThisArea
}) => {
  const [mapMode, setMapMode] = useState<'default' | 'satellite' | 'transit'>('default');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showNearMePulse, setShowNearMePulse] = useState(false);
  const [showSearchAreaAlert, setShowSearchAreaAlert] = useState(false);

  // Format price into compact '₹24k'
  const formatCompactRent = (val: number) => {
    return `₹${Math.round(val / 1000)}k`;
  };

  const handleNearMeClick = () => {
    setShowNearMePulse(true);
    setTimeout(() => setShowNearMePulse(false), 3000);
  };

  const handleSearchAreaClick = () => {
    setShowSearchAreaAlert(true);
    onSearchThisArea();
    setTimeout(() => setShowSearchAreaAlert(false), 2500);
  };

  return (
    <div className="relative w-full min-h-[600px] h-[680px] lg:h-[750px] rounded-2xl overflow-hidden border border-border bg-[#ECEEEA] shadow-card select-none">
      
      {/* Dynamic Map Visual Canvas */}
      <div 
        className={`w-full h-full absolute inset-0 transition-all duration-500 overflow-hidden ${
          mapMode === 'satellite' 
            ? 'bg-[#1F2923]' 
            : mapMode === 'transit' 
              ? 'bg-[#E7EBE8]' 
              : 'bg-[#F2F4F0]'
        }`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* SVG Vector Map Geography: Ahmedabad Urban Grid, Sabarmati River, Ring Roads, Lakes */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 1000 800" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Map Grid Lines */}
          <defs>
            <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke={mapMode === 'satellite' ? '#2A3830' : '#E0E4DE'} 
                strokeWidth="0.8" 
              />
            </pattern>
            <linearGradient id="river-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#81BFB4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5EA69A" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Background Grid Pattern */}
          <rect width="1000" height="800" fill="url(#city-grid)" />

          {/* Urban Green Belts & University Campus Areas */}
          {/* Nirma University & SG Highway North Green Zone */}
          <path 
            d="M 380 30 Q 500 50 490 120 Q 370 140 380 30 Z" 
            fill={mapMode === 'satellite' ? '#263B2B' : '#E2EBE4'} 
          />
          {/* Gujarat University & IIM-A Vastrapur Green Belt */}
          <path 
            d="M 320 320 Q 420 310 440 400 Q 360 450 320 320 Z" 
            fill={mapMode === 'satellite' ? '#263B2B' : '#DFE9E1'} 
          />
          {/* Prahlad Nagar Garden Park */}
          <circle cx="250" cy="540" r="45" fill={mapMode === 'satellite' ? '#263B2B' : '#DFE9E1'} />

          {/* Vastrapur Lake Body */}
          <path 
            d="M 410 380 Q 435 365 440 395 Q 425 420 405 405 Z" 
            fill="#72B5AA" 
            stroke="#5A9E93" 
            strokeWidth="2" 
          />
          <text x="408" y="372" fill="#43776F" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            Vastrapur Lake
          </text>

          {/* Sabarmati River Curving from North to South */}
          <path
            d="M 680 0 Q 710 180 660 300 T 630 500 Q 610 650 670 800"
            fill="none"
            stroke="url(#river-gradient)"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <text x="670" y="240" fill="#3D7E73" fontSize="12" fontWeight="bold" transform="rotate(75, 670, 240)" opacity="0.6">
            SABARMATI RIVERFRONT
          </text>

          {/* Major Road Arteries */}
          {/* SG Highway (diagonal north-south spine) */}
          <line 
            x1="380" y1="0" x2="480" y2="800" 
            stroke={mapMode === 'satellite' ? '#556658' : '#D6DBD4'} 
            strokeWidth="8" 
          />
          <text x="440" y="200" fill="#7D857C" fontSize="10" fontWeight="bold" transform="rotate(82, 440, 200)">
            S.G. HIGHWAY CORRIDOR
          </text>

          {/* 132ft Ring Road */}
          <path
            d="M 120 400 Q 480 340 590 400 Q 640 550 560 700"
            fill="none"
            stroke={mapMode === 'satellite' ? '#4A5B4F' : '#DCE2DA'}
            strokeWidth="6"
          />

          {/* Metro Rail Transit Corridor (Shown with dashed glowing line) */}
          <path
            d="M 300 780 L 450 480 L 620 380 L 880 120"
            fill="none"
            stroke={mapMode === 'transit' ? '#3B82F6' : '#94A3B8'}
            strokeWidth="4"
            strokeDasharray="8 5"
          />

          {/* Metro Station Nodes */}
          <circle cx="450" cy="480" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
          <text x="460" y="484" fill="#2563EB" fontSize="10" fontWeight="bold">
            Vastrapur Metro
          </text>

          <circle cx="620" cy="380" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
          <text x="630" y="384" fill="#2563EB" fontSize="10" fontWeight="bold">
            Navrangpura Metro
          </text>

          {/* Landmark Labels */}
          <text x="350" y="55" fill="#5F665E" fontSize="12" fontWeight="700">
            NIRMA UNIVERSITY / SG NORTH
          </text>
          <text x="820" y="110" fill="#245B4A" fontSize="13" fontWeight="800">
            GIFT CITY TECH REGION
          </text>
          <text x="180" y="540" fill="#5F665E" fontSize="11" fontWeight="600">
            Prahlad Nagar
          </text>
          <text x="260" y="310" fill="#5F665E" fontSize="11" fontWeight="600">
            Bodakdev
          </text>
          <text x="50" y="620" fill="#5F665E" fontSize="11" fontWeight="600">
            Shela / South Bopal
          </text>
        </svg>

        {/* User Geolocation Simulation Beacon ("Near Me") */}
        {showNearMePulse && (
          <div 
            className="absolute z-20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: '42%', top: '48%' }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-primary ring-4 ring-white shadow-card flex items-center justify-center text-white text-[9px] font-bold">
              You
            </div>
          </div>
        )}

        {/* Interactive Property Price Pins */}
        {properties.map((prop) => {
          const isHovered = hoveredPropertyId === prop.id;
          const isSelected = selectedPropertyId === prop.id;

          return (
            <div
              key={prop.id}
              className="absolute z-30 transition-all duration-300"
              style={{
                left: `${prop.coordinates?.x ?? 50}%`,
                top: `${prop.coordinates?.y ?? 50}%`,
                transform: 'translate(-50%, -100%)'
              }}
              onMouseEnter={() => onHoverProperty(prop.id)}
              onMouseLeave={() => onHoverProperty(null)}
              onClick={() => onSelectProperty(prop)}
            >
              {/* Custom Animated Price Tag Pin */}
              <div
                className={`group cursor-pointer flex flex-col items-center transition-all duration-200 ${
                  isSelected
                    ? 'scale-125 z-40'
                    : isHovered
                      ? 'scale-115 z-40'
                      : 'hover:scale-110'
                }`}
              >
                {/* Pin Header Pill */}
                <div
                  className={`px-2.5 py-1 rounded-full font-extrabold text-xs tracking-tight shadow-elevated border flex items-center space-x-1 transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-white ring-2 ring-primary/40'
                      : isHovered
                        ? 'bg-primary text-white border-primary shadow-elevated'
                        : 'bg-surface text-text-primary border-border hover:bg-primary hover:text-white'
                  }`}
                >
                  <span className="tabular-nums">{formatCompactRent(prop.baseRent ?? prop.base_rent ?? 15000)}</span>
                  {prop.verified && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </div>

                {/* Triangle Tail */}
                <div 
                  className={`w-2 h-2 rotate-45 -mt-1 border-r border-b transition-colors ${
                    isSelected || isHovered
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border group-hover:bg-primary group-hover:border-primary'
                  }`} 
                />

                {/* Radar ring when highlighted */}
                {(isHovered || isSelected) && (
                  <div className="w-8 h-8 rounded-full border-2 border-primary/40 animate-ping-subtle absolute -bottom-1 -z-10" />
                )}
              </div>

              {/* Hover Floating Mini Card Preview */}
              {(isHovered || isSelected) && (
                <div 
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-60 bg-surface rounded-xl shadow-dropdown border border-border p-2 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProperty(prop);
                  }}
                >
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-surfaceMuted mb-2">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {prop.propertyType}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                      ⭐ {prop.rating}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-text-primary truncate">
                    {prop.title}
                  </h4>
                  <p className="text-[10px] text-text-muted">
                    {prop.neighborhood} · {prop.carpetArea} sq ft
                  </p>

                  <div className="mt-1.5 pt-1.5 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block">TrueCost™ / mo</span>
                      <span className="text-xs font-bold text-primary">
                        ₹{prop.totalEstimatedMonthly.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-primary hover:underline">
                      View details →
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Map Controls Bar - Top Left */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2">
        
        {/* Search This Area Button */}
        <button
          onClick={handleSearchAreaClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface/95 backdrop-blur-md text-xs font-bold text-text-primary border border-border shadow-subtle hover:bg-surface hover:border-primary/40 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-primary" />
          <span>Search this area</span>
        </button>

        {/* Near Me Button */}
        <button
          onClick={handleNearMeClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface/95 backdrop-blur-md text-xs font-bold text-text-primary border border-border shadow-subtle hover:bg-surface hover:border-primary/40 transition-all"
          title="Locate my position in Ahmedabad"
        >
          <Navigation className="w-3.5 h-3.5 text-secondary" />
          <span>Near me</span>
        </button>

        {/* Draw Area Toggle */}
        <button
          onClick={() => setIsDrawing(!isDrawing)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            isDrawing
              ? 'bg-primary text-white border-primary shadow-subtle'
              : 'bg-surface/95 backdrop-blur-md text-text-primary border-border hover:bg-surface'
          }`}
          title="Draw custom boundary polygon"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Draw area</span>
        </button>
      </div>

      {/* Floating Map Layers Control - Top Right */}
      <div className="absolute top-3 right-3 z-30 flex items-center space-x-1 bg-surface/95 backdrop-blur-md p-1 rounded-xl border border-border shadow-subtle">
        
        <button
          onClick={() => setMapMode('default')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
            mapMode === 'default'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Map
        </button>

        <button
          onClick={() => setMapMode('satellite')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
            mapMode === 'satellite'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Satellite
        </button>

        <button
          onClick={() => setMapMode('transit')}
          className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
            mapMode === 'transit'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Train className="w-3 h-3" />
          <span>Metro</span>
        </button>
      </div>

      {/* Floating Zoom Controls - Bottom Right */}
      <div className="absolute bottom-4 right-3 z-30 flex flex-col space-y-1 bg-surface/95 backdrop-blur-md p-1 rounded-xl border border-border shadow-subtle">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-border my-0.5" />
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Metro Legend - Bottom Left */}
      <div className="absolute bottom-4 left-3 z-30 hidden sm:flex items-center space-x-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border text-[11px] text-text-secondary shadow-subtle">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Verified Space</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-1 bg-blue-500 rounded"></span>
          <span>Metro Corridor</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
          <span>Lake Zone</span>
        </div>
      </div>

      {/* Search Area Confirmation Toast */}
      {showSearchAreaAlert && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-text-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-dropdown flex items-center space-x-2 animate-in fade-in duration-200">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Refreshed {properties.length} verified listings in this boundary</span>
        </div>
      )}

      {/* Lasso Drawing Mode Overlay */}
      {isDrawing && (
        <div className="absolute inset-0 z-25 bg-black/10 backdrop-blur-[1px] cursor-crosshair flex items-center justify-center pointer-events-auto">
          <div className="bg-surface/95 px-4 py-2 rounded-xl shadow-card border border-primary text-xs font-semibold text-text-primary flex items-center space-x-2">
            <Pencil className="w-3.5 h-3.5 text-primary animate-bounce" />
            <span>Click and drag on map to filter by your custom commute perimeter</span>
            <button 
              onClick={() => setIsDrawing(false)}
              className="ml-2 text-primary font-bold hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
