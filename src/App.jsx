import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";
import YourChitti from "./pages/yourchitti";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Add your /chitti route */}
        <Route path="/chitti" element={<YourChitti />} />
        {/* You can add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
