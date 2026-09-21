import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { isAuthenticated, getUserRole } from '../utils/auth';


const PublicRoute = () => {
    // Agar user logged in hai, toh check karo uska role kya hai
    if (isAuthenticated()) {
        const role = getUserRole();

        if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
            return <Navigate to={ROUTES.ADMIN} replace />;
        }
        if (role === 'ROLE_LABOUR' || role === 'LABOUR') {
            return <Navigate to={ROUTES.LABOUR} replace />;
        }
        // Default customer fallback
        return <Navigate to={ROUTES.HOME} replace />;
    }

    // Agar logged in nahi hai, toh Login/Signup page dikhao
    return <Outlet />;
};

export default PublicRoute;