import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Networking from "./pages/Networking";

export default function App() {
  return (
    <HashRouter>
      <header className="landing-header" role="banner">
        <h1 className="landing-title">CSC: 4220</h1>

        <nav role="navigation">
          <ul className="landing-nav-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/networking">Networking Concepts</Link>
            </li>
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/networking" element={<Networking />} />
      </Routes>
    </HashRouter>
  );
}