export function BrandLogo({ priority = false }: { priority?: boolean }) {
  // The approved SVG is already resolution-independent. A native image avoids
  // shipping an image-optimization client for an asset that needs no transform.
  return (
    <img
      className="brand-logo"
      src="/assets/logo/logo-for-dark.svg"
      alt="TEVORLI — Digital Solutions"
      width={501}
      height={104}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
