import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ActivitiesPage from "./page/Activity";
import EventsPage from "./page/Event";
import UsersPage from "./page/Userpage";
import ScanQr from "./features/qr/page/ScanQr";
import Login from "./features/auth/pages/Login";
import NavLayout from "./features/common/component/NavLayout";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<NavLayout />}>
          <Route path="/scan/:activityId" element={<ScanQr />} />
          <Route path="/" index element={<EventsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/activity/:eventId" element={<ActivitiesPage />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
