import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import BoardForm from "./BoardForm";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail";
import MypageForm from "./MypageForm";
import BoardUpdateForm from "./BoardUpdateForm";
import $ from "jquery";
import {} from "jquery.cookie";

const Body = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 여부 확인 후 상태 업데이트
    const loginId = $.cookie("login_id");
    // 로그인 상태에 따라 true 또는 false, 빈 배열을 넣어 한 번만 실행
    setIsLoggedIn(!!loginId); 
  }, []);

  // 라우터 설정
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
        <Route path="/boardUpdate" element={<BoardUpdateForm />} />

      </Routes>
    </div>
  );
};

export default Body;
