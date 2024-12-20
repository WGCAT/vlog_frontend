import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
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

      // 이전 데이터 로드
      if (location?.state?.content) {
        ClassicEditor.setData(location.state.content);
      }

      ClassicEditor.model.document.on("change:data", () => {
        setData(ClassicEditor.getData());
      });
    };

    loadEditor();

    // 컴포넌트 언마운트 시 에디터 파괴
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
      alert("글 제목을 입력 해주세요.");
      boardTitleRef.current.focus();
      return;
    }

    if (!boardContent) {
      alert("글 내용을 입력 해주세요.");
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

    axios
      .post(url, send_param)
      .then((returnData) => {
        if (returnData.data.message) {
          alert(returnData.data.message);
          window.location.href = "/";
        } else {
          alert("글쓰기 실패");
        }
      })
      .catch((err) => {
        console.log(err);
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
    </div>
  );
};

export default BoardWriteForm;
