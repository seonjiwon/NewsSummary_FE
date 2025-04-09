import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/layout/PrivateRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import KeywordEdit from "./pages/KeywordEdit";
import NewsList from "./pages/NewsList";
import Admin from "./pages/Admin";
import Hello from "./pages/Hello";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hello" element={<Hello />} />
          <Route
            path="/keywords"
            element={
              <PrivateRoute>
                <KeywordEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/news"
            element={
              <PrivateRoute>
                <NewsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/news" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
