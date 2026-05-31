import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import Intelligence from "./pages/Intelligence.jsx";
import Predictor from "./pages/Predictor.jsx";
import ContentStudio from "./pages/ContentStudio.jsx";
import CampaignPage from "./pages/Campaign.jsx";
import Virality from "./pages/Virality.jsx";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/intelligence" element={<Intelligence />} />
        <Route path="/predictor" element={<Predictor />} />
        <Route path="/content" element={<ContentStudio />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/virality" element={<Virality />} />
      </Routes>
    </AppProvider>
  );
}
