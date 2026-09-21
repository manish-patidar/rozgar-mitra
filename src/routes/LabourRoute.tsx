import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { isAuthenticated, getUserRole } from '../utils/auth';

const LabourRoute = () => {
    if (!isAuthenticated()) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    const role = getUserRole();
    if (role !== 'ROLE_LABOUR' && role !== 'LABOUR') {
        // Agar labour nahi hai, toh wapas login/unauthorized bhej do
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
};

export default LabourRoute;