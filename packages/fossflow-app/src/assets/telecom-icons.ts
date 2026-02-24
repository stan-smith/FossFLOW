/**
 * Telecom / RF Engineering Icon Pack for FossFLOW
 *
 * Contains SVG icons for telecommunications equipment commonly used in
 * RF coverage planning, event capacity deployments, and site acceptance.
 */

const toDataUri = (svg: string): string => {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// COW (Cell on Wheels) - mobile cell trailer with antenna mast
const cowSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="15" y="55" width="70" height="25" rx="3" fill="#4a90d9" stroke="#2c5f8a" stroke-width="2"/>
  <rect x="20" y="60" width="15" height="15" rx="1" fill="#6ab0f0" stroke="#2c5f8a" stroke-width="1"/>
  <rect x="38" y="60" width="15" height="15" rx="1" fill="#6ab0f0" stroke="#2c5f8a" stroke-width="1"/>
  <circle cx="28" cy="85" r="5" fill="#333" stroke="#555" stroke-width="1.5"/>
  <circle cx="72" cy="85" r="5" fill="#333" stroke="#555" stroke-width="1.5"/>
  <line x1="50" y1="55" x2="50" y2="12" stroke="#666" stroke-width="3"/>
  <line x1="50" y1="12" x2="50" y2="8" stroke="#cc3333" stroke-width="2"/>
  <rect x="42" y="15" width="4" height="18" rx="1" fill="#cc3333" stroke="#991111" stroke-width="0.5"/>
  <rect x="54" y="15" width="4" height="18" rx="1" fill="#cc3333" stroke="#991111" stroke-width="0.5"/>
  <rect x="46" y="20" width="8" height="12" rx="1" fill="#cc3333" stroke="#991111" stroke-width="0.5"/>
</svg>`;

// Macro Cell Tower - lattice tower structure
const macroTowerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="50,5 35,95 65,95" fill="none" stroke="#666" stroke-width="2.5"/>
  <line x1="38" y1="30" x2="62" y2="30" stroke="#666" stroke-width="1.5"/>
  <line x1="37" y1="50" x2="63" y2="50" stroke="#666" stroke-width="1.5"/>
  <line x1="36" y1="70" x2="64" y2="70" stroke="#666" stroke-width="1.5"/>
  <line x1="38" y1="30" x2="63" y2="50" stroke="#888" stroke-width="1"/>
  <line x1="62" y1="30" x2="37" y2="50" stroke="#888" stroke-width="1"/>
  <line x1="37" y1="50" x2="64" y2="70" stroke="#888" stroke-width="1"/>
  <line x1="63" y1="50" x2="36" y2="70" stroke="#888" stroke-width="1"/>
  <rect x="30" y="10" width="5" height="16" rx="1" fill="#cc3333" stroke="#991111" stroke-width="0.5"/>
  <rect x="44" y="5" width="5" height="16" rx="1" fill="#cc3333" stroke="#991111" stroke-width="0.5"/>
  <rect x="65" y="10" width="5" height="16" rx="1" fill="#cc3333" stroke="#991111" stroke-width="0.5"/>
  <circle cx="50" cy="5" r="2" fill="#cc3333"/>
</svg>`;

// Sector Antenna - panel antenna
const sectorAntennaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="38" y="15" width="24" height="60" rx="3" fill="#e0e0e0" stroke="#888" stroke-width="2"/>
  <rect x="42" y="20" width="16" height="50" rx="2" fill="#c0c0c0" stroke="#999" stroke-width="1"/>
  <line x1="50" y1="25" x2="50" y2="65" stroke="#888" stroke-width="1" stroke-dasharray="3,3"/>
  <rect x="44" y="75" width="12" height="8" rx="1" fill="#888" stroke="#666" stroke-width="1"/>
  <circle cx="50" cy="30" r="2" fill="#4CAF50"/>
  <circle cx="50" cy="40" r="2" fill="#4CAF50"/>
  <circle cx="50" cy="50" r="2" fill="#FFC107"/>
  <circle cx="50" cy="60" r="2" fill="#FFC107"/>
  <path d="M 25 40 Q 15 50 25 60" fill="none" stroke="#4a90d9" stroke-width="1.5" opacity="0.6"/>
  <path d="M 18 35 Q 5 50 18 65" fill="none" stroke="#4a90d9" stroke-width="1.5" opacity="0.3"/>
</svg>`;

// BTS Cabinet
const btsCabinetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="10" width="60" height="80" rx="3" fill="#607d8b" stroke="#37474f" stroke-width="2"/>
  <rect x="25" y="15" width="50" height="20" rx="2" fill="#455a64" stroke="#37474f" stroke-width="1"/>
  <rect x="25" y="40" width="50" height="20" rx="2" fill="#455a64" stroke="#37474f" stroke-width="1"/>
  <rect x="25" y="65" width="50" height="20" rx="2" fill="#455a64" stroke="#37474f" stroke-width="1"/>
  <circle cx="70" cy="25" r="2" fill="#4CAF50"/>
  <circle cx="70" cy="50" r="2" fill="#4CAF50"/>
  <circle cx="70" cy="75" r="2" fill="#FFC107"/>
  <rect x="28" y="18" width="20" height="4" rx="1" fill="#78909c"/>
  <rect x="28" y="43" width="20" height="4" rx="1" fill="#78909c"/>
  <rect x="28" y="68" width="20" height="4" rx="1" fill="#78909c"/>
  <line x1="28" y1="28" x2="65" y2="28" stroke="#546e7a" stroke-width="0.5"/>
  <line x1="28" y1="53" x2="65" y2="53" stroke="#546e7a" stroke-width="0.5"/>
</svg>`;

// Microwave Dish - point-to-point
const microwaveDishSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse cx="50" cy="45" rx="30" ry="35" fill="#e0e0e0" stroke="#888" stroke-width="2"/>
  <ellipse cx="50" cy="45" rx="22" ry="27" fill="#ccc" stroke="#999" stroke-width="1"/>
  <ellipse cx="50" cy="45" rx="12" ry="15" fill="#bbb" stroke="#999" stroke-width="1"/>
  <circle cx="50" cy="45" r="4" fill="#ff6600" stroke="#cc4400" stroke-width="1"/>
  <line x1="50" y1="80" x2="50" y2="95" stroke="#666" stroke-width="4"/>
  <rect x="40" y="92" width="20" height="5" rx="1" fill="#555"/>
  <path d="M 80 25 Q 90 20 95 15" fill="none" stroke="#ff6600" stroke-width="1.5" opacity="0.5"/>
  <path d="M 82 30 Q 95 22 100 15" fill="none" stroke="#ff6600" stroke-width="1.5" opacity="0.3"/>
</svg>`;

// Fiber Node - fiber optic connection point
const fiberNodeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="25" width="50" height="50" rx="8" fill="#1565c0" stroke="#0d47a1" stroke-width="2"/>
  <circle cx="50" cy="50" r="15" fill="#1976d2" stroke="#0d47a1" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="6" fill="#42a5f5" stroke="#1565c0" stroke-width="1"/>
  <circle cx="50" cy="50" r="2" fill="#bbdefb"/>
  <line x1="10" y1="35" x2="25" y2="40" stroke="#2196f3" stroke-width="2"/>
  <line x1="10" y1="50" x2="25" y2="50" stroke="#2196f3" stroke-width="2"/>
  <line x1="10" y1="65" x2="25" y2="60" stroke="#2196f3" stroke-width="2"/>
  <line x1="75" y1="40" x2="90" y2="35" stroke="#2196f3" stroke-width="2"/>
  <line x1="75" y1="50" x2="90" y2="50" stroke="#2196f3" stroke-width="2"/>
  <line x1="75" y1="60" x2="90" y2="65" stroke="#2196f3" stroke-width="2"/>
</svg>`;

// Power Generator
const generatorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="15" y="35" width="70" height="45" rx="4" fill="#ff8f00" stroke="#e65100" stroke-width="2"/>
  <rect x="20" y="40" width="30" height="20" rx="2" fill="#ffa726" stroke="#e65100" stroke-width="1"/>
  <rect x="55" y="40" width="25" height="35" rx="2" fill="#ffb74d" stroke="#e65100" stroke-width="1"/>
  <line x1="60" y1="45" x2="75" y2="45" stroke="#e65100" stroke-width="1"/>
  <line x1="60" y1="50" x2="75" y2="50" stroke="#e65100" stroke-width="1"/>
  <line x1="60" y1="55" x2="75" y2="55" stroke="#e65100" stroke-width="1"/>
  <circle cx="35" cy="50" r="6" fill="#fff3e0" stroke="#e65100" stroke-width="1"/>
  <path d="M 33 46 L 37 50 L 33 54" fill="none" stroke="#e65100" stroke-width="1.5"/>
  <rect x="10" y="80" width="25" height="5" rx="1" fill="#333"/>
  <rect x="65" y="80" width="25" height="5" rx="1" fill="#333"/>
  <path d="M 40 18 L 45 28 L 38 28 L 43 38" fill="none" stroke="#FFC107" stroke-width="3" stroke-linecap="round"/>
  <path d="M 55 15 L 60 25 L 53 25 L 58 35" fill="none" stroke="#FFC107" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

// Event Stage
const stageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="10,40 50,20 90,40 90,85 10,85" fill="#37474f" stroke="#263238" stroke-width="2"/>
  <polygon points="10,40 50,20 90,40 50,60" fill="#455a64" stroke="#263238" stroke-width="1"/>
  <rect x="15" y="45" width="70" height="40" fill="#263238" stroke="#37474f" stroke-width="1"/>
  <rect x="25" y="55" width="15" height="25" rx="1" fill="#e91e63" opacity="0.8"/>
  <rect x="43" y="50" width="15" height="30" rx="1" fill="#9c27b0" opacity="0.8"/>
  <rect x="61" y="55" width="15" height="25" rx="1" fill="#2196f3" opacity="0.8"/>
  <circle cx="32" cy="48" r="3" fill="#FFC107"/>
  <circle cx="50" cy="43" r="3" fill="#FFC107"/>
  <circle cx="68" cy="48" r="3" fill="#FFC107"/>
  <line x1="15" y1="85" x2="15" y2="95" stroke="#455a64" stroke-width="3"/>
  <line x1="85" y1="85" x2="85" y2="95" stroke="#455a64" stroke-width="3"/>
</svg>`;

// Crowd Zone - high density user area
const crowdZoneSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse cx="50" cy="55" rx="40" ry="30" fill="#e3f2fd" stroke="#90caf9" stroke-width="1.5" stroke-dasharray="4,2"/>
  <circle cx="30" cy="45" r="5" fill="#1976d2"/><circle cx="30" cy="38" r="4" fill="#ffcc80"/>
  <circle cx="50" cy="40" r="5" fill="#1976d2"/><circle cx="50" cy="33" r="4" fill="#ffcc80"/>
  <circle cx="70" cy="45" r="5" fill="#1976d2"/><circle cx="70" cy="38" r="4" fill="#ffcc80"/>
  <circle cx="40" cy="58" r="5" fill="#1565c0"/><circle cx="40" cy="51" r="4" fill="#ffcc80"/>
  <circle cx="60" cy="58" r="5" fill="#1565c0"/><circle cx="60" cy="51" r="4" fill="#ffcc80"/>
  <circle cx="50" cy="70" r="5" fill="#0d47a1"/><circle cx="50" cy="63" r="4" fill="#ffcc80"/>
  <circle cx="25" cy="62" r="4" fill="#1565c0"/><circle cx="25" cy="56" r="3.5" fill="#ffcc80"/>
  <circle cx="75" cy="62" r="4" fill="#1565c0"/><circle cx="75" cy="56" r="3.5" fill="#ffcc80"/>
  <text x="50" y="92" text-anchor="middle" font-size="10" fill="#1976d2" font-weight="bold">60K+</text>
</svg>`;

// Small Cell / Picocell
const smallCellSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="40" width="40" height="35" rx="5" fill="#78909c" stroke="#455a64" stroke-width="2"/>
  <rect x="35" y="45" width="30" height="10" rx="2" fill="#90a4ae" stroke="#546e7a" stroke-width="1"/>
  <circle cx="40" cy="65" r="2.5" fill="#4CAF50"/>
  <circle cx="50" cy="65" r="2.5" fill="#4CAF50"/>
  <circle cx="60" cy="65" r="2.5" fill="#FFC107"/>
  <line x1="50" y1="40" x2="50" y2="25" stroke="#546e7a" stroke-width="2.5"/>
  <circle cx="50" cy="22" r="4" fill="#455a64" stroke="#37474f" stroke-width="1"/>
  <circle cx="50" cy="22" r="1.5" fill="#4CAF50"/>
  <path d="M 35 28 Q 25 22 35 16" fill="none" stroke="#4a90d9" stroke-width="1.5" opacity="0.5"/>
  <path d="M 65 28 Q 75 22 65 16" fill="none" stroke="#4a90d9" stroke-width="1.5" opacity="0.5"/>
  <rect x="42" y="75" width="16" height="5" rx="1" fill="#455a64"/>
  <line x1="50" y1="80" x2="50" y2="90" stroke="#546e7a" stroke-width="2"/>
</svg>`;

// Satellite Dish (VSAT)
const satelliteDishSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse cx="45" cy="40" rx="32" ry="35" fill="#e0e0e0" stroke="#888" stroke-width="2" transform="rotate(-15, 45, 40)"/>
  <ellipse cx="45" cy="40" rx="24" ry="27" fill="#d0d0d0" stroke="#999" stroke-width="1" transform="rotate(-15, 45, 40)"/>
  <ellipse cx="45" cy="40" rx="14" ry="17" fill="#c0c0c0" stroke="#999" stroke-width="1" transform="rotate(-15, 45, 40)"/>
  <circle cx="45" cy="40" r="4" fill="#1976d2" stroke="#0d47a1" stroke-width="1"/>
  <line x1="45" y1="40" x2="75" y2="20" stroke="#666" stroke-width="2"/>
  <circle cx="75" cy="20" r="3" fill="#ff6600"/>
  <line x1="50" y1="75" x2="50" y2="95" stroke="#555" stroke-width="4"/>
  <line x1="45" y1="55" x2="50" y2="80" stroke="#666" stroke-width="2.5"/>
  <rect x="38" y="92" width="24" height="5" rx="1" fill="#444"/>
</svg>`;

// Aggregation Router
const aggregationRouterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="10" y="30" width="80" height="40" rx="5" fill="#00695c" stroke="#004d40" stroke-width="2"/>
  <rect x="15" y="35" width="30" height="10" rx="2" fill="#00897b" stroke="#004d40" stroke-width="1"/>
  <rect x="15" y="50" width="30" height="10" rx="2" fill="#00897b" stroke="#004d40" stroke-width="1"/>
  <circle cx="55" cy="40" r="3" fill="#4CAF50"/>
  <circle cx="63" cy="40" r="3" fill="#4CAF50"/>
  <circle cx="71" cy="40" r="3" fill="#FFC107"/>
  <circle cx="79" cy="40" r="3" fill="#4CAF50"/>
  <circle cx="55" cy="55" r="3" fill="#4CAF50"/>
  <circle cx="63" cy="55" r="3" fill="#4CAF50"/>
  <circle cx="71" cy="55" r="3" fill="#2196f3"/>
  <circle cx="79" cy="55" r="3" fill="#2196f3"/>
  <line x1="5" y1="45" x2="10" y2="45" stroke="#2196f3" stroke-width="3"/>
  <line x1="5" y1="55" x2="10" y2="55" stroke="#2196f3" stroke-width="3"/>
  <line x1="90" y1="45" x2="95" y2="45" stroke="#ff6600" stroke-width="3"/>
  <line x1="90" y1="55" x2="95" y2="55" stroke="#ff6600" stroke-width="3"/>
  <text x="50" y="80" text-anchor="middle" font-size="8" fill="#00695c" font-weight="bold">AGG</text>
</svg>`;

export interface TelecomIcon {
  id: string;
  name: string;
  url: string;
  collection: string;
  isIsometric: boolean;
  scale: number;
}

export const telecomIcons: TelecomIcon[] = [
  {
    id: 'telecom__cow',
    name: 'COW (Cell on Wheels)',
    url: toDataUri(cowSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.2
  },
  {
    id: 'telecom__macro_tower',
    name: 'Macro Cell Tower',
    url: toDataUri(macroTowerSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.3
  },
  {
    id: 'telecom__sector_antenna',
    name: 'Sector Antenna',
    url: toDataUri(sectorAntennaSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.0
  },
  {
    id: 'telecom__bts_cabinet',
    name: 'BTS Cabinet',
    url: toDataUri(btsCabinetSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.0
  },
  {
    id: 'telecom__microwave_dish',
    name: 'Microwave Dish',
    url: toDataUri(microwaveDishSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.0
  },
  {
    id: 'telecom__fiber_node',
    name: 'Fiber Node',
    url: toDataUri(fiberNodeSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 0.9
  },
  {
    id: 'telecom__generator',
    name: 'Power Generator',
    url: toDataUri(generatorSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.0
  },
  {
    id: 'telecom__stage',
    name: 'Event Stage',
    url: toDataUri(stageSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.4
  },
  {
    id: 'telecom__crowd_zone',
    name: 'Crowd Zone',
    url: toDataUri(crowdZoneSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.5
  },
  {
    id: 'telecom__small_cell',
    name: 'Small Cell',
    url: toDataUri(smallCellSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 0.8
  },
  {
    id: 'telecom__satellite_dish',
    name: 'Satellite Dish (VSAT)',
    url: toDataUri(satelliteDishSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.1
  },
  {
    id: 'telecom__aggregation_router',
    name: 'Aggregation Router',
    url: toDataUri(aggregationRouterSvg),
    collection: 'telecom',
    isIsometric: false,
    scale: 1.0
  }
];

// Export as default for dynamic import compatibility
export default {
  name: 'telecom',
  collections: {
    'Telecom / RF Engineering': telecomIcons.map(icon => ({
      ...icon,
      collection: 'telecom'
    }))
  }
};
