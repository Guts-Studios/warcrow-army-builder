
import { Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import Rules from "@/pages/Rules";
import UnitStats from "@/pages/UnitStats";
import Game from "@/pages/Game";
import Setup from "@/pages/Setup";
import Play from "@/pages/Play";
import Deployment from "@/pages/Deployment";
import Scoring from "@/pages/Scoring";
import Summary from "@/pages/Summary";
import Missions from "@/pages/Missions";
import Mail from "@/pages/Mail";
import SharedList from "@/pages/SharedList";
import AboutUs from "@/pages/AboutUs";
import Activity from "@/pages/Activity";
import Landing from "@/pages/Landing";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/builder" element={<Index />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/unit-stats" element={<UnitStats />} />
      <Route path="/game" element={<Game />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/play/:gameId" element={<Play />} />
      <Route path="/deployment/:gameId" element={<Deployment />} />
      <Route path="/scoring/:gameId" element={<Scoring />} />
      <Route path="/summary/:gameId" element={<Summary />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/mail" element={<Mail />} />
      <Route path="/shared-list/:id" element={<SharedList />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
