import { lazy } from "react";

export default {
  serviceName: "Dashboard",
  slug: "dashboard",
  color: "bg-gray-100",
  order: 1,
  // component: lazy(() => import("./index")),
  sheets: [
    {
      sheetName: "Last History",
      slug: "last_history",
      component: lazy(() => import("./sheets/last-history")),
      order: 1,
    },
    {
      sheetName: "Test Page",
      slug: "test",
      component: lazy(() => import("./sheets/test")),
      order: 2,
    },
  ],
};
