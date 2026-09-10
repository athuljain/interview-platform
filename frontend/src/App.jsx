import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import FacultyPage from "./pages/FacultyPage";
import CoursePage from "./pages/CoursePage";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyQuestions from "./pages/FacultyQuestion";
import InternDashboard from "./pages/InternDashboard";
import InternPractice from "./pages/InternPractice";

// Interview
import Interview from "./pages/Interview";
import Result from "./pages/Result";


// Protected Route
function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// Main App
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faculty"
          element={
            <ProtectedRoute roles={["admin"]}>
              <FacultyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute roles={["admin"]}>
              <CoursePage />
            </ProtectedRoute>
          }
        />


        {/* ================= FACULTY ================= */}

        <Route
          path="/faculty"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/questions/:courseId"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <FacultyQuestions />
            </ProtectedRoute>
          }
        />


        {/* ================= INTERN ================= */}

        <Route
          path="/intern"
          element={
            <ProtectedRoute roles={["intern"]}>
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern/practice"
          element={
            <ProtectedRoute roles={["intern"]}>
              <InternPractice />
            </ProtectedRoute>
          }
        />


        {/* ================= INTERVIEW ================= */}

        <Route
          path="/interview"
          element={
            <ProtectedRoute roles={["intern"]}>
              <Interview />
            </ProtectedRoute>
          }
        />


        {/* ================= RESULT ================= */}

        <Route
          path="/result"
          element={
            <ProtectedRoute roles={["intern"]}>
              <Result />
            </ProtectedRoute>
          }
        />


        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <h1>404 - Page Not Found</h1>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


// Auth Provider
export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}