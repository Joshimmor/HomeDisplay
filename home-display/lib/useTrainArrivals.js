"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fetches upcoming train arrivals and keeps their "minutes until" countdown
 * ticking locally every second, without hammering the API. Refetches on the
 * given interval (default 30s) to stay in sync with real schedule changes.
 *
 * @param {Object} options
 * @param {string} options.line - e.g. "JZ"
 * @param {number} options.latitude
 * @param {number} options.longitude
 * @param {number} [options.pollIntervalMs=30000]
 */
export function useTrainArrivals({ line, latitude, longitude, pollIntervalMs = 30000 }) {
  const [rawArrivals, setRawArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  const controllerRef = useRef(null);

  // Poll the API on an interval
  useEffect(() => {
    let cancelled = false;

    async function fetchArrivals() {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const url = `https://mta-train-service.vercel.app/${line}?Latitude=${latitude}&Longitude=${longitude}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`API responded ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          console.log("Fetched arrivals:", data);
          setRawArrivals(Array.isArray(data.trains) ? data.trains.splice(0, 4) : []);
          setError(null);
          setLastUpdated(new Date());
        }
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setError(err.message || "Failed to load arrivals");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchArrivals();
    const pollId = setInterval(fetchArrivals, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(pollId);
      controllerRef.current?.abort();
    };
  }, [line, latitude, longitude, pollIntervalMs]);

  // Tick every second so countdowns move without waiting on the network
  useEffect(() => {
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, []);

  const arrivals = rawArrivals
    .map((raw) => {
      const time = new Date(raw.time);
      const minutesUntil = Math.round((time.getTime() - now) / 60000);
      return { direction: raw.direction, time, minutesUntil };
    })
    // drop trains that already left more than a minute ago
    .filter((a) => a.minutesUntil >= -1)
    .sort((a, b) => a.minutesUntil - b.minutesUntil);
    console.log("Processed arrivals:", arrivals);

  return { arrivals, isLoading, error, lastUpdated };
}
