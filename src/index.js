import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // HashRouter -> BrowserRouter
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

// React 18 이상에서 권장되는 방식으로 createRoot 사용
const root = ReactDOM.createRoot(document.getElementById("container"));

root.render(
  <BrowserRouter>
    <Header />
    <Body />
    <Footer />
  </BrowserRouter>
);
