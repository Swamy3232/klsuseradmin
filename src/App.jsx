import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";
import ScrollToTop from "./components/ScrollToTop";
import { CollectionsProvider, useCollectionsContext } from "./context/CollectionsContext";

import Footer from "./components/footer";
import HomePage from "./pages/HomePage";
import YourChitti from "./pages/yourchitti";
import PaymentUpdateForm from "./pages/payment";
import Contact from "./pages/contact";
import KLSGoldCollections from "./pages/Collections";
import MetalRateCalculator from "./pages/MetalCalculator";
import Gallery from "./pages/Gallery";
import GoldChittiCalculator from "./pages/chittical";

function AppContent() {
  const { isFullscreenCollections } = useCollectionsContext();

  return (
    <>
      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Navbar - Hidden in fullscreen collections mode */}
      {!isFullscreenCollections && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      )}

      {/* Page Content - bottom padding clears fixed bottom menu bar */}
      <div className={isFullscreenCollections ? "" : "pt-20 sm:pt-28 lg:pt-40 pb-20 min-h-screen"}>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<HomePage />} />

          {/* Other pages */}
          <Route path="/chitti" element={<YourChitti />} />
          <Route path="/update-your-payment" element={<PaymentUpdateForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collection" element={<KLSGoldCollections />} />
          <Route path="/metal-calculator" element={<MetalRateCalculator />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/chitti-calculator" element={<GoldChittiCalculator />} />
        </Routes>

        {/* Footer - Hidden in fullscreen collections mode */}
        {!isFullscreenCollections && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <CollectionsProvider>
        <AppContent />
      </CollectionsProvider>
    </Router>
  );
}

export default App;
