import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = () => {
    return isAuthenticated() ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />;
};

export default PublicRoute;
