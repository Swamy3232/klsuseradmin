import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";

import Footer from "./components/footer";
import HomePage from "./pages/HomePage";
import YourChitti from "./pages/yourchitti";
import PaymentUpdateForm from "./pages/payment";
import Contact from "./pages/contact";
import KLSGoldCollections from "./pages/Collections";
import MetalRateCalculator from "./pages/MetalCalculator";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Page Content */}
      <div className="pt-20 min-h-screen"> {/* Adjust pt-20 to match navbar height */}
        <Routes>
          {/* Home page */}
          <Route path="/" element={<HomePage />} />

          {/* Other pages */}
          <Route path="/chitti" element={<YourChitti />} />
          <Route path="/update-your-payment" element={<PaymentUpdateForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collection" element={<KLSGoldCollections />} />
          <Route path="/metal-calculator" element={<MetalRateCalculator />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
