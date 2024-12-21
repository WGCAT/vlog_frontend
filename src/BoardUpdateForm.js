import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const BoardUpdateForm = () => {
  // CK에디터에 들어갈 내용
  const [data, setData] = useState(""); 
  const boardTitleRef = useRef();
  const editorRef = useRef();
  // location 가져옴
  const location = useLocation(); 

  useEffect(() => {
    // location.state가 전달되었는지 확인
    // undefined 방지 위해 optional chaining 사용
    console.log("Location State:", location?.state); 

    if (location?.state?.title) {
      // 제목 설정
      boardTitleRef.current.value = location.state.title; 
    }
    if (location?.state?.content) {
      // 내용 설정
      setData(location.state.content); 
    }

    // CK에디터 초기화
    const loadEditor = async () => {
      const ClassicEditor = await window.ClassicEditor.create(document.querySelector("#editor"));
      editorRef.current = ClassicEditor;

      if (location?.state?.content) {
        // 초기 내용 설정
        ClassicEditor.setData(location.state.content); 
      }

      ClassicEditor.model.document.on("change:data", () => {
        // CK에디터 내용 변경 시 상태 업데이트
        setData(ClassicEditor.getData()); 
      });
    };

    loadEditor();

    return () => {
      // 컴포넌트 언마운트 시 CK에디터 제거
      if (editorRef.current) {
        editorRef.current.destroy(); 
      }
    };
    // location 변화 시 재렌더링
  }, [location]); 

  // 글 수정
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
          // 글쓰기 후 목록으로 리디렉션
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
