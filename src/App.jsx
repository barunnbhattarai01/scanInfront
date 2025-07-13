import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ActivitiesPage from "./page/Activity";
import EventsPage from "./page/Event";
import UsersPage from "./page/Userpage";
import ScanQr from "./features/qr/page/ScanQr";
import Login from "./features/auth/pages/Login";
function App() {
  return (
    <Router>{

      //<nav style={{ padding: 10, borderBottom: "1px solid #ccc", maxWidth: 600, margin: "20px auto" }}>
      // <Link to="/events" style={{ marginRight: 10, color: "#2563eb", textDecoration: "underline" }}>Events</Link>
      //<Link to="/users" style={{ color: "#2563eb", textDecoration: "underline" }}>Users</Link>
      //</nav>
    }

      <Routes>
        <Route path="/scan" element={<ScanQr />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/activity/:eventId" element={<ActivitiesPage />} />
        <Route path="*" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

