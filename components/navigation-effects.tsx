"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Explicitly reset document position for routes that share a layout. Next's
// automatic scroll heuristic can otherwise retain a position inside the page.
export function NavigationEffects() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const focusRoute = previousPath.current !== pathname;
    previousPath.current = pathname;
    let frame = 0;
    const position = (anchorChange = false, focus = focusRoute) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let id = "";
        try {
          id = decodeURIComponent(window.location.hash.slice(1));
        } catch {
          /* Invalid hashes have no target. */
        }
        const target = id ? document.getElementById(id) : null;
        if (target) {
          target.scrollIntoView({
            block: "start",
            behavior:
              anchorChange &&
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "smooth"
                : "instant",
          });
          if (target instanceof HTMLElement)
            target.focus({ preventScroll: true });
        } else if (!anchorChange) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          if (focus)
            document.getElementById("main")?.focus({ preventScroll: true });
        }
      });
    };
    const hashChanged = () => position(true);
    const sameRoute = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const a =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (
        !(a instanceof HTMLAnchorElement) ||
        a.target === "_blank" ||
        a.hasAttribute("download")
      )
        return;
      const url = new URL(a.href);
      if (
        url.origin === location.origin &&
        url.pathname === location.pathname &&
        !url.hash
      )
        position(false, true);
    };
    position();
    window.addEventListener("hashchange", hashChanged);
    document.addEventListener("click", sameRoute);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", hashChanged);
      document.removeEventListener("click", sameRoute);
    };
  }, [pathname]);
  return null;
}
