import React from "react";
import { TabsContainer } from "./components/TabsContainer";
import { Route, Routes } from "react-router";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/:tab?" element={<TabsContainer />} />
    </Routes>
  );
};
