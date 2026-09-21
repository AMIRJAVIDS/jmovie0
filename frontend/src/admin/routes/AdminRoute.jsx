import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, isAuth, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        در حال بررسی دسترسی...
      </div>
    );
  }

  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  if (!user?.is_staff) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
