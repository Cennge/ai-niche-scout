"use client"

import * as React from "react"

import { MAX_COMPARE } from "@/lib/compare"

// Startups picked for comparison, kept in localStorage and shared across tabs.
// The compare page itself is rendered from the URL; see CompareSync.

const STORAGE_KEY = "ans:compare"
const EMPTY: string[] = []

let cache: string[] | null = null
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    return Array.isArray(parsed)
      ? parsed.filter((d): d is string => typeof d === "string").slice(0, MAX_COMPARE)
      : EMPTY
  } catch {
    return EMPTY
  }
}

function set(next: string[]) {
  cache = next.slice(0, MAX_COMPARE)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // Storage can be unavailable (private mode). The selection then lasts for this page view.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = read()
      listener()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function getSnapshot() {
  return (cache ??= read())
}

function getServerSnapshot() {
  return EMPTY
}

export function useCompare() {
  const domains = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    domains,
    has: (domain: string) => domains.includes(domain),
    toggle: (domain: string) =>
      set(
        domains.includes(domain)
          ? domains.filter((d) => d !== domain)
          : [...domains, domain].slice(-MAX_COMPARE),
      ),
    replace: set,
  }
}
