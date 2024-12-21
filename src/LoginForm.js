import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class LoginForm extends Component {

  // 회원가입
  join = () => {
    const joinEmail = this.joinEmail.value;
    const joinName = this.joinName.value;
    const joinPw = this.joinPw.value;
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (joinEmail === "" || joinEmail === undefined) {
      toast.error("이메일 주소를 입력해주세요.");
      this.joinEmail.focus();
      return;
    } else if (joinEmail.match(regExp) === null || joinEmail.match(regExp) === undefined) {
      toast.error("이메일 형식에 맞게 입력해주세요.");
      this.joinEmail.value = "";
      this.joinEmail.focus();
      return;
    } else if (joinName === "" || joinName === undefined) {
      toast.error("이름을 입력해주세요.");
      this.joinName.focus();
      return;
    } else if (joinPw === "" || joinPw === undefined) {
      toast.error("비밀번호를 입력해주세요.");
      this.joinPw.focus();
      return;
    }

    const send_param = {
      headers,
      email: this.joinEmail.value,
      name: this.joinName.value,
      password: this.joinPw.value,
    };

    axios.post("http://localhost:8080/member/join", send_param).then((returnData) => {
        if (returnData.data.message) {
          toast.success(returnData.data.message);
          if (returnData.data.dupYn === "1") {
            this.joinEmail.value = "";
            this.joinEmail.focus();
          } else {
            this.joinEmail.value = "";
            this.joinName.value = "";
            this.joinPw.value = "";
          }
        } else {
          toast.error("회원가입 실패");
        }
      }).catch((err) => {
        console.log(err);
        toast.error("서버와의 연결에 실패했습니다.");
      });
  };

  // 로그인
  login = () => {
    const loginEmail = this.loginEmail.value;
    const loginPw = this.loginPw.value;

    if (loginEmail === "" || loginEmail === undefined) {
      toast.error("이메일 주소를 입력해주세요.");
      this.loginEmail.focus();
      return;
    } else if (loginPw === "" || loginPw === undefined) {
      toast.error("비밀번호를 입력해주세요.");
      this.loginPw.focus();
      return;
    }

    const send_param = {
      headers,
      email: this.loginEmail.value,
      password: this.loginPw.value,
    };

    axios.post("http://localhost:8080/member/login", send_param).then((returnData) => {
      if (returnData.data.message === "로그인 되었습니다!") {
        $.cookie("login_id", returnData.data._id, { expires: 1 });
        $.cookie("login_email", returnData.data.email, { expires: 1 });
        toast.success(returnData.data.message);
        // 로그인 성공 시 새로고침
        window.location.reload();
      } else {
        toast.error(returnData.data.message);
        // 로그인 실패 시 입력창 초기화
        this.loginEmail.value = "";
        this.loginPw.value = "";
      }
    }).catch((err) => {
      console.log(err);
      toast.error("서버와의 연결에 실패했습니다.");
    });
  };

  render() {
    const formStyle = { 
      margin: "50px auto",
      maxWidth: "300px",
    };
    const buttonStyle = { marginTop: 10 };

    return (
      <Form style={formStyle}>
        <Form.Group controlId="joinForm">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" maxLength="100" ref={(ref) => (this.joinEmail = ref)} placeholder="Enter email" />
          <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
          <br></br>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" maxLength="20" ref={(ref) => (this.joinName = ref)} placeholder="Name" />
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" maxLength="64" ref={(ref) => (this.joinPw = ref)} placeholder="Password" />
          <Button style={buttonStyle} onClick={this.join} variant="primary" type="button" className="d-block w-100">
            회원가입
          </Button>
        </Form.Group>

        <Form.Group controlId="loginForm">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" maxLength="100" ref={(ref) => (this.loginEmail = ref)} placeholder="Enter email" />
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" maxLength="20" ref={(ref) => (this.loginPw = ref)} placeholder="Password" />
          <Button style={buttonStyle} onClick={this.login} variant="primary" type="button" className="d-block w-100">
            로그인
          </Button>
        </Form.Group>
        <ToastContainer />
      </Form>
    );
  }
}

export default LoginForm;
