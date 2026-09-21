import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ROUTES } from "../utils/constants";

import Login from "../pages/Login/login";
import Signup from "../pages/Signup/Signup";

// Route Guards
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import LabourRoute from './LabourRoute';

// Layouts
import { AdminLayout } from "../components/admin/AdminLayout";
import { CustomerLayout } from "../components/customer/CustomerLayout";
import { LabourLayout } from "../pages/Labour/views/LabourLayout.tsx";
// import { LabourLayout } from "../components/labour/LabourLayout";

// Admin Views
const Overview = lazy(() => import("../pages/Admin/views/Overviews").then(({ Overview: page }) => ({ default: page })));
const Customers = lazy(() => import("../pages/Admin/views/Customers").then(({ Customers: page }) => ({ default: page })));
const Labours = lazy(() => import("../pages/Admin/views/Labours").then(({ Labours: page }) => ({ default: page })));
const Services = lazy(() => import("../pages/Admin/views/Services").then(({ Services: page }) => ({ default: page })));
const Tasks = lazy(() => import("../pages/Admin/views/Tasks").then(({ Tasks: page }) => ({ default: page })));

// Customer Views
const CustomerServices = lazy(() => import("../pages/Customer/views/CustomerServices").then(({ CustomerServices: page }) => ({ default: page })));
const CustomerProfile = lazy(() => import("../pages/Customer/views/CustomerProfile").then(({ CustomerProfile: page }) => ({ default: page })));
const CustomerBookings = lazy(() => import("../pages/Customer/views/CustomerBookings").then(({ CustomerBookings: page }) => ({ default: page })));

// Labour Views (NEW IMPORTS ADDED HERE)
const LabourDashboard = lazy(() => import("../pages/Labour/views/LabourDashboard").then(({ LabourDashboard: page }) => ({ default: page })));
const EditProfile = lazy(() => import("../pages/Labour/views/EditProfile").then(({ EditProfile: page }) => ({ default: page })));
const ServicesList = lazy(() => import("../pages/Labour/views/ServicesList").then(({ ServicesList: page }) => ({ default: page })));
const OpenServices = lazy(() => import("../pages/Labour/views/OpenServices").then(({ OpenServices: page }) => ({ default: page })));
const CompletedServices = lazy(() => import("../pages/Labour/views/CompletedServices").then(({ CompletedServices: page }) => ({ default: page })));

const RouteLoading = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<RouteLoading />}>
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route element={<PublicRoute />}>
                    <Route path={ROUTES.SIGNUP} element={<Signup />} />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                </Route>

                {/* CUSTOMER ROUTES */}
                <Route element={<PrivateRoute />}>
                    <Route element={<CustomerLayout />}>
                        <Route path={ROUTES.HOME} element={<CustomerServices />} />
                        <Route path={`${ROUTES.HOME}/bookings`} element={<CustomerBookings />} />
                        <Route path={`${ROUTES.HOME}/profile`} element={<CustomerProfile />} />
                    </Route>
                </Route>

                {/* LABOUR ROUTES (UPDATED) */}
                <Route element={<LabourRoute />}>
                    <Route element={<LabourLayout />}>
                        {/* Default Dashboard */}
                        <Route path={ROUTES.LABOUR} element={<LabourDashboard />} />

                        {/* Naye Routes */}
                        <Route path={`${ROUTES.LABOUR}/profile`} element={<EditProfile />} />
                        <Route path={`${ROUTES.LABOUR}/services`} element={<ServicesList />} />
                        <Route path={`${ROUTES.LABOUR}/open-services`} element={<OpenServices />} />
                        <Route path={`${ROUTES.LABOUR}/completed-services`} element={<CompletedServices />} />
                    </Route>
                </Route>

                {/* ADMIN ROUTES */}
                <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path={ROUTES.ADMIN} element={<Overview />} />
                        <Route path={`${ROUTES.ADMIN}/customers`} element={<Customers />} />
                        <Route path={`${ROUTES.ADMIN}/labours`} element={<Labours />} />
                        <Route path={`${ROUTES.ADMIN}/services`} element={<Services />} />
                        <Route path={`${ROUTES.ADMIN}/tasks`} element={<Tasks />} />
                    </Route>
                </Route>

                {/* FALLBACK ROUTE */}
                <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;