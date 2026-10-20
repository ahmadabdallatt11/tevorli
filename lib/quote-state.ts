"use client";
import { useSearchParams } from "next/navigation";
import { readQuoteService } from "./contact";

// Call inside a Suspense boundary: the static fallback offers generic contact
// links, and the hydrated view reads only the allowlisted service parameter.
export function useQuoteService() {
  return readQuoteService(useSearchParams().get("service"));
}
