import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { isAuthenticated, getUserRole } from '../utils/auth';

const AdminRoute = () => {
    // 1. Agar login hi nahi hai, toh login page par bhejo
    if (!isAuthenticated()) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // 2. Agar login hai par admin nahi hai, toh Home page par bhejo (Unauthorized access rokne ke liye)
    if (getUserRole() !== 'ROLE_ADMIN') {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    // 3. Agar Admin hai, toh page dikhao
    return <Outlet />;
};

export default AdminRoute;