import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom"; // useLocation 훅 임포트
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const BoardUpdateForm = () => {
  const [data, setData] = useState(""); // CKEditor에 들어갈 내용
  const boardTitleRef = useRef();
  const editorRef = useRef();
  const location = useLocation(); // useLocation을 사용하여 location 가져오기

  useEffect(() => {
    // location.state가 전달되었는지 확인
    console.log("Location State:", location?.state); // undefined 방지 위해 optional chaining 사용

    if (location?.state?.title) {
      boardTitleRef.current.value = location.state.title; // 제목 설정
    }
    if (location?.state?.content) {
      setData(location.state.content); // 내용 설정
    }

    // CKEditor 초기화
    const loadEditor = async () => {
      const ClassicEditor = await window.ClassicEditor.create(document.querySelector("#editor"));
      editorRef.current = ClassicEditor;

      if (location?.state?.content) {
        ClassicEditor.setData(location.state.content); // 초기 내용 설정
      }

      ClassicEditor.model.document.on("change:data", () => {
        setData(ClassicEditor.getData()); // CKEditor 내용이 변경되면 상태 업데이트
      });
    };

    loadEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy(); // 컴포넌트 언마운트 시 CKEditor 제거
      }
    };
  }, [location]); // location 변화 시 재렌더링

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

    // 글 수정 로직
    if (location?.state?._id) {
      url = "http://localhost:8080/board/update"; // 글 수정
      send_param = {
        headers,
        _id: location.state._id, // 수정할 글의 ID
        title: boardTitle,
        content: boardContent,
      };
    } else {
      // 글쓰기
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
          window.location.href = "/"; // 글쓰기 후 목록으로 리디렉션
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
      <h2>글수정</h2>
      <Form.Control
        type="text"
        style={titleStyle}
        placeholder="글 제목"
        ref={boardTitleRef}
      />
      <div id="editor"></div>
      <Button style={buttonStyle} onClick={writeBoard} className="d-block w-100">
        수정하기
      </Button>
      <ToastContainer />
    </div>
  );
};

export default BoardUpdateForm;
