import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const BoardWriteForm = ({ location }) => {
  const [data, setData] = useState("");
  const boardTitleRef = useRef();
  const editorRef = useRef();

  useEffect(() => {
    // 제목 및 내용 초기화
    if (location?.state?.title) {
      boardTitleRef.current.value = location.state.title;
    }
    if (location?.state?.content) {
      setData(location.state.content);
    }

    // CKEditor 초기화
    const loadEditor = async () => {
      const ClassicEditor = await window.ClassicEditor.create(document.querySelector("#editor"));
      editorRef.current = ClassicEditor;
      
      if (location?.state?.content) {
        ClassicEditor.setData(location.state.content);
      }

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
  }, [location]);

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

    let url;
    let send_param;

    if (location?.state?._id) {
      url = "http://localhost:8080/board/update";
      send_param = {
        headers,
        _id: location.state._id,
        title: boardTitle,
        content: boardContent,
      };
    } else {
      url = "http://localhost:8080/board/write";
      send_param = {
        headers,
        _id: $.cookie("login_id"),
        title: boardTitle,
        content: boardContent,
      };
    }

    console.log("Request URL:", url);
    console.log("Request Data:", send_param);

    axios
      .post(url, send_param)
      .then((returnData) => {
        console.log("Server Response:", returnData.data);
        if (returnData.data.message) {
          toast.success(returnData.data.message);
          window.location.href = "/";
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
  const buttonStyle = { marginTop: 5 };

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
      <Button style={buttonStyle} onClick={writeBoard} className="d-block w-100">
        저장하기
      </Button>
      <ToastContainer />
    </div>
  );
};

export default BoardWriteForm;
