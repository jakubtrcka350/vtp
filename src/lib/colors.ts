export const colors = {
  // Brand
  accent: "#f06820",       // primary orange — change here to retheme the whole site
  cobalt: "#0047AB",       // secondary blue accent

  // Backgrounds
  bg:        "#0a0a0a",    // page background
  surface:   "#111111",    // card / panel
  surface2:  "#1c1c1c",    // elevated surface
  surfaceAlt: "#0d0d0d",   // alternate section background

  // Borders
  border:    "#262626",
  borderSub: "#2a2a2a",

  // Text
  textPrimary: "#f0f0f0",
  textMuted:   "#9a9a9a",
  textDim:     "#555555",
  textFaint:   "#444444",
} as const;

export type Colors = typeof colors;
