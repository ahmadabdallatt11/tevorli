"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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
          id = decodeURIComponent(location.hash.slice(1));
        } catch {
          /* Malformed fragment: treat as no target. */
        }
        const target = id ? document.getElementById(id) : null;
        if (target) {
          // One scroll operation: no competing native hash scroll, CSS smooth
          // scroll or focus scroll. The non-sticky header needs no offset.
          target.scrollIntoView({
            block: "start",
            behavior:
              anchorChange &&
              !matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "smooth"
                : "instant",
          });
          target.focus({ preventScroll: true });
        } else if (!anchorChange) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          if (focus)
            document.getElementById("main")?.focus({ preventScroll: true });
        }
      });
    };
    const hashChanged = () => position(true, true);
    const historyChanged = () => position(false, true);
    const sameRoute = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
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
        (a.target && a.target !== "_self") ||
        a.hasAttribute("download")
      )
        return;
      const url = new URL(a.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search
      )
        return;
      if (url.hash) {
        let target: HTMLElement | null;
        try {
          target = document.getElementById(
            decodeURIComponent(url.hash.slice(1)),
          );
        } catch {
          return;
        }
        if (!target) return;
        event.preventDefault();
        if (location.hash !== url.hash) history.pushState(null, "", url.href);
        position(true, true);
      } else {
        // Even a link to the current page must return to its beginning.
        event.preventDefault();
        if (location.hash) history.pushState(null, "", url.href);
        position(false, true);
      }
    };
    position();
    window.addEventListener("hashchange", hashChanged);
    window.addEventListener("popstate", historyChanged);
    document.addEventListener("click", sameRoute, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", hashChanged);
      window.removeEventListener("popstate", historyChanged);
      document.removeEventListener("click", sameRoute, true);
    };
  }, [pathname]);
  return null;
}
