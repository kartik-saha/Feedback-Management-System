// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import UserSettings from './pages/UserSettings/UserSettings';
import Notifications from './pages/Notifications/Notifications';
import CreateSurvey from './pages/CreateSurvey/CreateSurvey';
import Analytics from './pages/Analytics/Analytics';
import Home from './pages/Home/Home';
import ViewSurvey from './pages/ViewSurvey/ViewSurvey';
import SurveyResults from './pages/Analytics/SurveyResults'; // ✅ Import new results page

import usePageTitle from './hooks/usePageTitle';
import { ToastWrapper } from './components/Toast/Toast'; // ✅ Toasts

export default function App() {
  usePageTitle();

  return (
    <div className="App">
      <ToastWrapper /> {/* ✅ Toast mount */}
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

        {/* ✅ Standalone route for survey result view */}
        <Route path="/analytics/survey/:id" element={<SurveyResults />} />
      </Routes>
    </div>
  );
}
