
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
        <p className="text-warcrow-gold font-semibold mb-2 text-sm md:text-base">🚧 Still in Development!</p>
        <p className="text-warcrow-text text-sm md:text-base">
          News 4/29: We took a break from the grind and we are back to work! Smoothing out Play Mode has been a challenge and the community
          has pointed out some rules issues that we've cleaned up. Fixing issues and making optimizations but we will be pushing new updates soon!
        </p>       
      </div>
    </div>
  );
};
