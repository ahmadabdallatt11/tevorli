import localFont from "next/font/local";
const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const cairo = localFont({
  src: "../node_modules/@fontsource-variable/cairo/files/cairo-arabic-wght-normal.woff2",
  variable: "--font-cairo",
  display: "swap",
  weight: "200 1000",
});
export const fontClasses = `${inter.variable} ${cairo.variable}`;
