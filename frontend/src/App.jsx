// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import UserSettings from './pages/UserSettings/UserSettings';
import Notifications from './pages/Notifications/Notifications';
import CreateSurvey from './pages/CreateSurvey/CreateSurvey';
import Analytics from './pages/Analytics/Analytics';
import Home from './pages/Home/Home';
import ViewSurvey from './pages/ViewSurvey/ViewSurvey'; // ✅ Import ViewSurvey
import usePageTitle from './hooks/usePageTitle';

export default function App() {
  usePageTitle();

  return (
    <div className="App">
      <Routes>
        <Route
          element={
            <>
              <Dashboard />
              <main style={{ paddingTop: '80px' }}>
                <Outlet />
              </main>
            </>
          }
        >
          <Route index element={<Home />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/create" element={<CreateSurvey />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/survey/:id" element={<ViewSurvey />} />
        </Route>
      </Routes>
    </div>
  );
}
