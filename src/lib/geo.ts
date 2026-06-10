// Tiny geo helpers for the Word Atlas: equirectangular projection + a
// deliberately schematic world silhouette built from rough lat/lon polygons.
// No D3, no topojson — the map is a backdrop, dots carry the data.

export const MAP_W = 1000;
export const MAP_H = 460;
const LAT_TOP = 75; // clip Arctic
const LAT_BOTTOM = -55; // clip Antarctic
const LON_LEFT = -170;
const LON_RIGHT = 180;

export function project(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - LON_LEFT) / (LON_RIGHT - LON_LEFT)) * MAP_W;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * MAP_H;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

/** Rough continent outlines as [lat, lon] rings (schematic on purpose). */
const RINGS: [number, number][][] = [
  // North America
  [[70, -162], [72, -128], [70, -92], [62, -82], [58, -64], [47, -53], [44, -66], [35, -76], [25, -80], [29, -95], [19, -96], [15, -93], [8, -78], [16, -100], [23, -110], [34, -120], [48, -125], [59, -152], [64, -166]],
  // Greenland (clipped)
  [[75, -58], [70, -22], [60, -44], [67, -54]],
  // South America
  [[8, -78], [11, -62], [0, -50], [-8, -35], [-23, -41], [-35, -57], [-51, -69], [-55, -71], [-40, -74], [-18, -71], [-4, -81]],
  // Africa
  [[35, -7], [37, 10], [31, 32], [12, 43], [11, 51], [-1, 42], [-16, 40], [-26, 33], [-34, 20], [-15, 12], [1, 9], [5, -8], [15, -17], [28, -13]],
  // Eurasia (one blob, Suez to Bering)
  [[36, -9], [44, -9], [48, -4], [51, 2], [54, 8], [57, 8], [62, 5], [71, 25], [69, 40], [73, 55], [75, 95], [72, 130], [69, 160], [66, 178], [60, 163], [50, 140], [43, 134], [30, 122], [21, 108], [9, 105], [13, 100], [16, 95], [22, 90], [15, 81], [7, 78], [20, 72], [25, 66], [25, 57], [22, 60], [16, 53], [12, 45], [21, 39], [28, 33], [31, 32], [36, 35], [36, 28], [40, 26], [38, 22], [40, 18], [44, 12], [43, 4], [40, 0], [36, -6]],
  // British Isles
  [[58, -6], [54, 0], [50, -5], [53, -10]],
  // Scandinavia tail is in Eurasia; Japan arc:
  [[45, 142], [41, 141], [34, 139], [31, 131], [37, 137]],
  // Maritime Southeast Asia (schematic blob)
  [[6, 95], [-4, 104], [-8, 114], [-9, 124], [-3, 128], [1, 117], [5, 108]],
  // Philippines
  [[18, 121], [13, 124], [6, 126], [10, 119]],
  // Australia
  [[-12, 131], [-11, 142], [-19, 147], [-27, 153], [-38, 147], [-35, 137], [-33, 115], [-22, 113], [-15, 124]],
  // Madagascar
  [[-12, 49], [-20, 49], [-25, 45], [-16, 44]],
];

/** SVG path string for the whole silhouette (computed once at module load). */
export const WORLD_PATH: string = RINGS.map((ring) => {
  const pts = ring.map(([lat, lon]) => project(lat, lon));
  return 'M' + pts.map((p) => `${p.x},${p.y}`).join('L') + 'Z';
}).join(' ');
