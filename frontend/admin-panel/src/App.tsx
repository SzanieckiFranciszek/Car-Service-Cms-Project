import { useEffect, useState } from "react";
import "./App.css";
import { useUserContext } from "./contexts/UserContext";
import Dashboard from "./pages/dashboard/Dashboard";
import Gallery from "./pages/dashboard/subpages/gallery/Gallery";
import Home from "./pages/dashboard/subpages/home/Home";
import Opinions from "./pages/dashboard/subpages/opinions/Opinions";
import Posts from "./pages/dashboard/subpages/posts/Posts";
import Pages from "./pages/dashboard/subpages/sections/Pages";
import Login from "./pages/login/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isReady } = useUserContext();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    if (isReady) {
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [token, isReady]);

  if (isAuthenticated === undefined) {
    return null;
  } else if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="pages" element={<Pages />} />
          <Route path="posts" element={<Posts />} />
          <Route path="opinions" element={<Opinions />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
