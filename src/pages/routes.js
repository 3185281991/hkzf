import Home from "./Home";
import CityList from "./CityList";
import News from "./News";
import Profile from "./Profile";
import { Navigate } from "react-router-dom";
const routes = [
  {
    path: "/index",
    element: <Home />,
  },
  {
    path: "/citylist",
    element: <CityList />,
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/",
    element: <Navigate to="/index" />,
  },
];
export default routes;
