"use client";

import { useEffect, useMemo, useState } from "react";
import { useTrainArrivals } from "@/lib/useTrainArrivals";

function formatCountdown(minutesUntil) {
  if (minutesUntil <= 0) return "Now";
  if (minutesUntil === 1) return "1";
  return String(minutesUntil);
}

/**
 * @param {Object} props
 * @param {string} [props.line="JZ"]
 * @param {number} props.latitude
 * @param {number} props.longitude
 * @param {string} [props.stationLabel]
 * @param {string} [props.lineIconSrc] - path to the line's SVG badge, e.g. "/j.svg"
 * @param {number} [props.rotateEveryMs=6000]
 */
export default function TrainArrivals({
  line = "JZ",
  latitude,
  longitude,
  stationLabel = "85 St – Forest Pkwy",
  lineIconSrc = "/j.svg",
  rotateEveryMs = 6000,
}) {
  const { arrivals, isLoading, error, lastUpdated } = useTrainArrivals({
    line,
    latitude,
    longitude,
  });

  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);


  // Build "pages" of up to 2 rows: one per direction, paired by rank so we
  // cycle through every upcoming arrival rather than just the soonest two.
  const pages = useMemo(() => {
    const byDirection = new Map();
    for (const a of arrivals) {
      const bucket = byDirection.get(a.direction) ?? [];
      bucket.push(a);
      byDirection.set(a.direction, bucket);
    }
    const directions = Array.from(byDirection.keys());
    const maxLen = Math.max(0, ...directions.map((d) => byDirection.get(d).length));

    const result = [];
    for (let i = 0; i < maxLen; i++) {
      const row = directions.map((d) => byDirection.get(d)[i]).filter(Boolean);
      if (row.length) result.push(row);
    }
    return result.length ? result : [[]];
  }, [arrivals]);

  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (pages.length <= 1) return;
    const id = setInterval(() => {
      setPageIndex((p) => (p + 1) % pages.length);
    }, rotateEveryMs);
    return () => clearInterval(id);
  }, [pages.length, rotateEveryMs]);

  useEffect(() => {
    // keep index in range if the number of pages shrinks
    if (pageIndex >= pages.length) setPageIndex(0);
  }, [pages.length, pageIndex]);

  const visibleRows = pages[pageIndex] ?? [];

  return (
    <section className="flex h-[35vh] min-h-[25vh] w-full flex-col overflow-hidden rounded-2xl border border-[#E2E5EA] bg-white shadow-sm">
      {/* header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E2E5EA] bg-[#F7F8FA] px-6 py-3">
        <div className="flex items-center gap-3">
          <img src={lineIconSrc} alt={`${line} train`} className="h-8 w-8" />
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-[#1A1D23]">
              Train Arrivals
            </h2>
            <p className="text-xs text-[#6B7280]">{stationLabel}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-[#1A1D23]">
            {clock.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </p>
          {error && <p className="text-[10px] text-[#D64545]">offline</p>}
        </div>
      </div>

      {/* rows — fill remaining panel height */}
      <div className="flex flex-1 flex-col divide-y divide-[#EEF0F3]">
        {isLoading && (
          <div className="flex flex-1 items-center px-6 text-base text-[#6B7280]">
            Loading arrivals…
          </div>
        )}

        {!isLoading && visibleRows.length === 0 && (
          <div className="flex flex-1 items-center px-6 text-base text-[#6B7280]">
            No upcoming trains
          </div>
        )}

        {!isLoading &&
          visibleRows.map((arrival) => {
            const urgent = arrival.minutesUntil <= 1;
            const soon = arrival.minutesUntil <= 5;
            return (
              <div
                key={`${arrival.direction}-${arrival.time.toISOString()}`}
                className="flex h-[50%] flex-1 items-center justify-between px-6"
              >
                <div className="flex items-center gap-4">
                  <img src={lineIconSrc} alt={`${line} train`} className="h-10 w-10 shrink-0" />
                  <div>
                    <p className="font-display text-xl font-semibold text-[#1A1D23]">
                      {arrival.direction}
                    </p>
                    <p className="text-sm text-[#6B7280]">{stationLabel}</p>
                  </div>
                </div>

                <div
                  key={arrival.minutesUntil}
                  className={`flip-digit min-w-[5.5rem] rounded-lg border-2 px-4 py-2 text-center font-mono text-xl font-bold leading-none ${
                    urgent
                      ? "border-[#D64545] text-[#D64545]"
                      : soon
                      ? "border-[#C98A17] text-[#C98A17]"
                      : "border-[#DADEE3] text-[#1A1D23]"
                  }`}
                >
                  {formatCountdown(arrival.minutesUntil)}
                  <div className="mt-1 text-xs font-normal uppercase tracking-wide text-[#6B7280]">
                    {arrival.minutesUntil <= 0 ? "" : "min"}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* pagination dots, mirrors the physical sign's carousel indicator */}
      {pages.length > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-1.5 border-t border-[#E2E5EA] bg-[#F7F8FA] py-2">
          {pages.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === pageIndex ? "bg-[#1A1D23]" : "bg-[#DADEE3]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}