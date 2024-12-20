import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import BoardForm from "./BoardForm";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail";
import MypageForm from "./MypageForm";
import $ from "jquery";
import {} from "jquery.cookie";

const Body = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 여부를 확인하고 상태를 업데이트
    const loginId = $.cookie("login_id");
    setIsLoggedIn(!!loginId); // 로그인 상태에 따라 true 또는 false 설정
  }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

  return (
    <div>
      <Routes>
        <Route path="/mypage" element={<MypageForm />} />
        <Route path="/boardWrite" element={<BoardWriteForm />} />
        <Route path="/board/detail" element={<BoardDetail />} />
        <Route
          path="/"
          element={isLoggedIn ? <BoardForm /> : <LoginForm />}
        />
      </Routes>
    </div>
  );
};

export default Body;
