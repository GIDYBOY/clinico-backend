import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {Dashboard} from "@/components"


const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated && user?.role !== "admin") {
    // Redirect to the sign-in page if not authenticated
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
    </Routes >
  )

}

export default ProtectedRoute;