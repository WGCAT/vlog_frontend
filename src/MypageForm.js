import React, { useState } from "react";
import { Form, Button, Toast } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const MypageForm = () => {
  const [email] = useState($.cookie("login_email"));
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 회원정보 수정
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
        if (response.data.message === "현재 비밀번호가 일치하지 않습니다.") {
          setError(response.data.message);
          setMessage("");
          return;
        }

        setMessage(response.data.message);
        setError(""); 

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        setError("회원정보 수정 중 오류가 발생했습니다.");
        setMessage("");
      });
  };

  // 회원탈퇴
  const handleDelete = () => {
    if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
      axios
        .post("http://localhost:8080/member/deleteAccount", { email }, { headers })
        .then((response) => {
          setMessage(response.data.message);
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
    maxWidth: "300px",
  };

  return (
    <>
      <div style={formStyle}>
        {message && <Toast onClose={() => setMessage("")} show={message !== ""} delay={3000} autohide style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <Toast.Body>{message}</Toast.Body>
        </Toast>}
        {error && <Toast onClose={() => setError("")} show={error !== ""} delay={3000} autohide style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
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
