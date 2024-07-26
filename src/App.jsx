import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AppContext } from "/src/contexts/AppContext";
import Preparation from "/src/preparation/Preparation";
import Navbar from "/src/navbar/Navbar";
import Routes from "/src/routes/Routes";
export default function App() {
  const { info, loginCheck } = useContext(AppContext);
  const location = useLocation();

  if (!info || !loginCheck) {
    return (
      <main>
        <Preparation />
      </main>
    );
  }
  if (location.state?.from) {
    return (
      <Navigate to="/login" state={{ to: location.state.from.pathname }} />
    );
  }
  return (
    <main>
      <Navbar />
      <Routes />
    </main>
  );
}
