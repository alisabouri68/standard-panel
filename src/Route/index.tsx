import { lazy } from "react";
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import AppLayout from "../AppLayout";

const Login = lazy(() => import("Layouts/login"));
const Welcome = lazy(() => import("Layouts/welcome"));
const MonoDash = lazy(() => import("Layouts/monoDash"));

const Header = lazy(() => import("BOX/BOX_header"));
const Sidebar = lazy(() => import("BOX/BOX_nav"));

const AuthProvider = lazy(() => import("Providers/authProvider"));

const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <Navigate to={"/view/smartComp/welcome"} replace />,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "view/smartComp/welcome",
        Component: () => (
          <AuthProvider>
            <Header />
            <Welcome />
          </AuthProvider>
        ),
      },
      {
        path: "view/smartComp/monoDash/:serviceName/:sheetName?/:id?",
        Component: () => (
          <AuthProvider>
            <Header />
            <div className="flex p-6 gap-5 h-full">
              <div className="w-20 bg-white rounded-xl shadow-md">
                <Sidebar />
              </div>
              <div id="panel" className="flex w-full gap-5">
                <MonoDash />
              </div>
            </div>
          </AuthProvider>
        ),
      },
    ],
  },
];

export default createBrowserRouter(routes);
