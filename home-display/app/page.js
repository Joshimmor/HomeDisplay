import TrainArrivals from "@/components/TrainArrivals";
import DashboardCard from "@/components/DashboardCard";

// Fixed home location — this display always sits in the same spot, so there's
// no need for geolocation prompts. Swap in your real coordinates.
const HOME_LATITUDE = 40.6892;
const HOME_LONGITUDE = -73.8656;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F0F2F5] p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <TrainArrivals
          line="JZ"
          latitude={HOME_LATITUDE}
          longitude={HOME_LONGITUDE}
          stationLabel="85 St – Forest Pkwy"
          lineIconSrc="https://upload.wikimedia.org/wikipedia/commons/f/f9/NYCS-bull-trans-J-Std.svg"
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
        </div>
    </main>
  );
}