import {Navigate, Route, Routes} from "react-router-dom";
import Login from "../pages/Login/login";
import Signup from "../pages/Signup/Signup";
import Home from "../pages/Home/Home";
import CategoryDetail from "../pages/CategoryDetail/CategoryDetail";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import {ROUTES} from "../utils/constants";

const AppRoutes = () => {
 return (
  <Routes>
   <Route element={<PublicRoute />}>
    <Route path={ROUTES.SIGNUP} element={<Signup />} />
    <Route path={ROUTES.LOGIN} element={<Login />} />
   </Route>

   <Route element={<PrivateRoute />}>
    <Route path={ROUTES.HOME} element={<Home />} />
    <Route path={ROUTES.CATEGORY_DETAIL} element={<CategoryDetail />} />
   </Route>

   <Route path="*" element={<Navigate to={ROUTES.SIGNUP} replace />} />
  </Routes>
 );
};

export default AppRoutes;
