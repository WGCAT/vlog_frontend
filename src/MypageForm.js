import React, { useState, useEffect } from "react";
import { Form, Button, Toast } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const MypageForm = () => {
  const [email, setEmail] = useState($.cookie("login_email"));
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // 사용자의 정보 로드 (예시: 이메일과 이름을 서버에서 가져오는 로직)
    // axios.get("http://localhost:8080/member/getInfo", { headers }).then((response) => {
    //   setName(response.data.name);
    // });
  }, []);

  const handleUpdate = () => {
    if (newPassword !== newPasswordCheck) {
      setError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const updatedInfo = {
      email,
      name,
      password,
      newPassword,
    };

    axios
      .post("http://localhost:8080/member/updateInfo", updatedInfo, { headers })
      .then((response) => {
        setMessage("회원정보가 성공적으로 수정되었습니다.");
        setError(""); // 에러 메시지 초기화
      })
      .catch((error) => {
        setError("회원정보 수정 중 오류가 발생했습니다.");
        setMessage(""); // 성공 메시지 초기화
      });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      axios
        .post("http://localhost:8080/member/deleteAccount", { email }, { headers })
        .then((response) => {
          setMessage("회원 탈퇴가 완료되었습니다.");
          // 로그아웃 후 리다이렉트
          $.removeCookie("login_id");
          window.location.href = "/";
        })
        .catch((error) => {
          setError("회원탈퇴 중 오류가 발생했습니다.");
        });
    }
  };

  const formStyle = { 
    margin: "50px auto",
    maxWidth: "300px", // 폼 최대 너비 설정
  };

  return (
    <>
      <div style={formStyle}>
        {message && <Toast onClose={() => setMessage("")} show={message !== ""} delay={3000} autohide>
          <Toast.Body>{message}</Toast.Body>
        </Toast>}
        {error && <Toast onClose={() => setError("")} show={error !== ""} delay={3000} autohide>
          <Toast.Body>{error}</Toast.Body>
        </Toast>}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>email</Form.Label>
          <Form.Control
            type="email"
            disabled
            value={email}
          />
          <Form.Label>name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Label>password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <Form.Label>new password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <Form.Label>new password check</Form.Label>
          <Form.Control
            type="password"
            value={newPasswordCheck}
            onChange={(e) => setNewPasswordCheck(e.target.value)}
            placeholder="Confirm new password"
          />
        </Form.Group>
        <Button
          variant="primary"
          className="d-block w-100"
          style={{ marginBottom: "5px" }}
          onClick={handleUpdate}
        >
          회원정보 수정
        </Button>
        <Button
          variant="danger"
          className="d-block w-100"
          onClick={handleDelete}
        >
          회원 탈퇴
        </Button>
      </div>
    </>
  );
};

export default MypageForm;
