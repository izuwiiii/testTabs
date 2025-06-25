import React from "react";
import { TabsContainer } from "./components/TabsContainer";
import { Route, Routes } from "react-router";
import { TabContent } from "./components/TabContent";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TabsContainer />}>
        <Route path=":tab?" element={<TabContent />} />
      </Route>
    </Routes>
  );
};
