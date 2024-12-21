import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const BoardWriteForm = () => {
  const [data, setData] = useState("");
  const boardTitleRef = useRef();
  const editorRef = useRef();

  useEffect(() => {
    // CK에디터 초기화
    const loadEditor = async () => {
      const ClassicEditor = await window.ClassicEditor.create(document.querySelector("#editor"));
      editorRef.current = ClassicEditor;

      ClassicEditor.model.document.on("change:data", () => {
        setData(ClassicEditor.getData());
      });
    };

    loadEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  // 글쓰기
  const writeBoard = () => {
    const boardTitle = boardTitleRef.current.value;
    const boardContent = data;

    if (!boardTitle) {
      toast.error("글 제목을 입력 해주세요.");
      boardTitleRef.current.focus();
      return;
    }

    if (!boardContent) {
      toast.error("글 내용을 입력 해주세요.");
      return;
    }

    const send_param = {
      headers,
      _id: $.cookie("login_id"),
      title: boardTitle,
      content: boardContent,
    };

    console.log("Request Data:", send_param);

    // axios
    axios
      .post("http://localhost:8080/board/write", send_param)
      .then((returnData) => {
        console.log("Server Response:", returnData.data);
        if (returnData.data.message) {
          toast.success(returnData.data.message);
          window.location.href = "/"; // 글쓰기 후 목록으로 이동
        } else {
          toast.error("글쓰기 실패");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
        toast.error("서버와의 연결에 실패했습니다.");
      });
  };

  const divStyle = { margin: 50 };
  const titleStyle = { marginBottom: 5 };
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
  };
  const buttonStyle = { width: "100px" };

  return (
    <div style={divStyle} className="App">
      <h2>글쓰기</h2>
      <Form.Control
        type="text"
        style={titleStyle}
        placeholder="글 제목"
        ref={boardTitleRef}
      />
      <div id="editor"></div>
      <div style={buttonContainerStyle}>
        <Button style={buttonStyle} onClick={writeBoard}>
          저장하기
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BoardWriteForm;
