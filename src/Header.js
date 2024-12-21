import React, { useState, useEffect } from "react";
import { Navbar, Button, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const Header = () => {
  const [buttonDisplay, setButtonDisplay] = useState("none");

  useEffect(() => {
    if ($.cookie("login_id")) {
      setButtonDisplay("block");
    } else {
      setButtonDisplay("none");
    }
  }, []);

  // 로그아웃
  const logout = () => {
    axios.get("http://localhost:8080/member/logout", { headers }).then(returnData => {
      if (returnData.data.message) {
        $.removeCookie("login_id");
        toast.success("로그아웃 되었습니다!");
        window.location.href = "/";
      }
    }).catch(err => {
      toast.error("로그아웃 중 오류가 발생했습니다.");
    });
  };

  const buttonStyle = {
    margin: "0px 5px 0px 10px",
    display: buttonDisplay,
  };

  return (
    <div>
      <Navbar>
        <Navbar.Brand href="/">모든 요일의 기록</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <NavLink to="/">
            <Button style={buttonStyle} variant="primary">
              글목록
            </Button>
          </NavLink>
          <NavLink to="/boardWrite">
            <Button style={buttonStyle} variant="primary">
              글쓰기
            </Button>
          </NavLink>
          <NavLink to="/myPage">
            <Button style={buttonStyle} variant="primary">
              내 정보
            </Button>
          </NavLink>
          <Button style={buttonStyle} onClick={logout} variant="primary">
            로그아웃
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <Image src="./img/keyboard.jpg" style={{ width: "100%", height: "300px", objectFit: "cover" }} />
      <ToastContainer />
    </div>
  );
};

export default Header;
