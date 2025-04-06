import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DebtMarket from "./components/DebtMarket/DebtMarket.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DebtMarket />
  </StrictMode>,
);
