import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { isAuthenticated } from '../utils/auth';

const PrivateRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
