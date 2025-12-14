import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Manage from "./pages/Manage";

/**
 * This component protects private pages
 * If token exists → allow page
 * If not → redirect to /login
 */
function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div>
      {/* Top Navigation */}
      <header style={{ padding: 16 }}>
        <button onClick={() => navigate("/")}>Dashboard</button>{" "}
        <button onClick={() => navigate("/manage")}>Admin Manage</button>{" "}
        <button onClick={logout}>Logout</button>
      </header>

      {/* Routes */}
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Private routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage"
          element={
            <PrivateRoute>
              <Manage />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
