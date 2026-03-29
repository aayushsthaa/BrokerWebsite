import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/navBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/BuyerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedProperties from "./pages/SavedProperties";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import BrokerDashboard from "./pages/BrokerDashboard";

function App() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="">
      <NavBar />
      <Routes>
        <Route path="/" element={isAuthenticated ? user?.role === "Broker"? <BrokerDashboard/>:<Dashboard /> : <Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/saved" element={<SavedProperties />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Broker"]} />} >
          <Route path="/add-property" element={<AddProperty />}  />
        </Route>
        <Route path="*" element={<div className="p-20 text-center text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;

