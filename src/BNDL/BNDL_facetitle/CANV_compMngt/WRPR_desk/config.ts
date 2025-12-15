import { lazy } from "react";

export default {
  serviceName: "Comp Mngt",
  slug: "component",
  color: "bg-green-100",
  order: 2,
  sheets: [
    {
      sheetName: "Component Maker",
      slug: "component_maker",
      component: lazy(() => import("./sheets/componentMaker")),
      auxiliary: lazy(() => import("./sheets/componentMaker/assistance")),
      order: 6,
      color: "bg-green-100",
    },
  ],
};
