import TrainArrivals from "@/components/TrainArrivals";
import DashboardCard from "@/components/DashboardCard";

// Fixed home location — this display always sits in the same spot, so there's
// no need for geolocation prompts. Swap in your real coordinates.
const HOME_LATITUDE = 40.6892;
const HOME_LONGITUDE = -73.8656;

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="Calendar" eyebrow="Today">
            <p className="text-[#9CA3AF]">Hook up your calendar feed here.</p>
          </DashboardCard>

          <DashboardCard title="Network" eyebrow="Home">
            <p className="text-[#9CA3AF]">Router/ISP throughput goes here.</p>
          </DashboardCard>

          <DashboardCard title="Electrical Use" eyebrow="Live">
            <p className="text-[#9CA3AF]">Smart-meter data goes here.</p>
          </DashboardCard>
        </div>
    </main>
    </div>
  );
}