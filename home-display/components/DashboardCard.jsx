/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function DashboardCard({ title, eyebrow, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E2E5EA] bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-3">
        {eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
            {eyebrow}
          </p>
        )}
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-[#1A1D23]">
          {title}
        </h3>
      </div>
      <div className="text-sm text-[#4B5563]">{children}</div>
    </section>
  );
}