import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";
import YourChitti from "./pages/yourchitti";
import PaymentUpdateForm from "./pages/payment";
// import KlsGoldSlider from "./pages/fslider";
// import KlsGoldSlider from "../public/fslider";
// import KlsGoldSlider from "./pages/fsliders";
// import HomePage from "./pages/HomePage";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home page */}
        <Route path="/" element={<YourChitti />} />

        {/* Other pages */}
        <Route path="/chitti" element={<YourChitti />} />
        <Route path="/update-your-payment" element={<PaymentUpdateForm />} />
      </Routes>
    </Router>
  );
}

export default App;
