
import { getLatestVersion } from "@/utils/version";

interface HeaderProps {
  latestVersion: string;
  userCount: number | null;
  isLoadingUserCount: boolean;
}

export const Header = ({ latestVersion, userCount, isLoadingUserCount }: HeaderProps) => {
  return (
    <div className="text-center space-y-6 md:space-y-8">
      <img 
        src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
        alt="Warcrow Logo" 
        className="w-64 md:w-[32rem] mx-auto"
      />
      <h1 className="text-2xl md:text-4xl font-bold text-warcrow-gold">
        Welcome to Warcrow Army Builder
      </h1>
      <div className="text-warcrow-gold/80 text-xs md:text-sm">Version {latestVersion}</div>
      <p className="text-lg md:text-xl text-warcrow-text">
        Create and manage your Warcrow army lists with ease.
      </p>
      <p className="text-md md:text-lg text-warcrow-gold/80">
        {isLoadingUserCount ? (
          "Loading user count..."
        ) : (
          `Currently serving ${userCount} users and growing!`
        )}
      </p>
      <div className="bg-warcrow-accent/50 p-3 md:p-4 rounded-lg">
        <p className="text-warcrow-gold font-semibold mb-2 text-sm md:text-base">🚧 Still in Development</p>
        <p className="text-warcrow-text text-sm md:text-base">
          This application is actively being developed with frequent updates and improvements.
          We appreciate your patience and feedback!/n/n

          Try out the new Profile feature! Some pieces are not working 100% yet but the core 
          part works which is helping us with Play Mode and a few other things.
        </p>
      </div>
    </div>
  );
};
