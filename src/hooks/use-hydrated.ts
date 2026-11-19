"use client";

import { useSyncExternalStore } from "react";

/** Devuelve false durante el render del servidor y true tras el montaje en cliente. */
function subscribe(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
