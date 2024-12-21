import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

// React18 이상에서 createRoot 사용 권장함
const root = ReactDOM.createRoot(document.getElementById("container"));

root.render(
  <BrowserRouter>
    <Header />
    <Body />
    <Footer />
  </BrowserRouter>
);
