import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";
import YourChitti from "./pages/yourchitti";
import SimpleUpiPayment from "./pages/payment";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Add your /chitti route */}
        <Route path="/chitti" element={<YourChitti />} />
        <Route path="/payment" element={<SimpleUpiPayment />} />
        {/* You can add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
