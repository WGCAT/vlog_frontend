import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const BoardUpdateForm = () => {
  const [data, setData] = useState(""); // CKEditor에 들어갈 내용
  const boardTitleRef = useRef();
  const editorRef = useRef();
  const location = useLocation(); // location 가져옴

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
      // 컴포넌트 언마운트 시 CKEditor 제거
      if (editorRef.current) {
        editorRef.current.destroy(); 
      }
    };
    // location 변화 시 재렌더링
  }, [location]); 

  const updateBoard = () => {
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
      url = "http://localhost:8080/board/update";
      send_param = {
        headers,
        _id: location.state._id,
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
  const buttonContainerStyle = { display: "flex", justifyContent: "flex-end", marginTop: 5 };
  const buttonStyle = { width: "100px" };

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
      
      <div style={buttonContainerStyle}>
        <Button style={buttonStyle} onClick={updateBoard}>
          수정하기
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default BoardUpdateForm;
