import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
import AuthLayout from "./components/AuthLayout";
// import GradeAssignmentPage from "./pages/GradeAssignmentPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/teams"
            element={
              <AuthLayout>
                <TeamsPage />
              </AuthLayout>
            }
          />
          <Route
            path="/assignments"
            element={
              <AuthLayout>
                <AssignmentsPage />
              </AuthLayout>
            }
          />
          <Route
            path="/assignments/:id"
            element={
              <AuthLayout>
                <AssignmentDetailPage />
              </AuthLayout>
            }
          />
          <Route
            path="/assignments/create"
            element={
              <AuthLayout>
                <CreateAssignmentPage />
              </AuthLayout>
            }
          />
          {/* <Route
          path="/assignments/grade/:id"
          element={<GradeAssignmentPage />}
        /> */}
          <Route
            path="/profile"
            element={
              <AuthLayout>
                <ProfilePage />
              </AuthLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
