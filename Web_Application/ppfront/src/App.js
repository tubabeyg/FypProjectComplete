import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import Menu from "./core/Menu";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <MainRouter />
    </BrowserRouter>
  );
}

export default App;
