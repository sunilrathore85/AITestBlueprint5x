import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Intelligent Test Planning AI Agent</h1>
        <nav>
          <Link to="/">Main</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}