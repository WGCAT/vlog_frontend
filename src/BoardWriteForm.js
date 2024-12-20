import React, { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const BoardWriteForm = ({ location }) => {
  const [data, setData] = useState("");
  const boardTitleRef = useRef();

  useEffect(() => {
    if (location?.state?.title) {
      boardTitleRef.current.value = location.state.title;
    }

    if (location?.state?.content) {
      setData(location.state.content);
    }
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

  const onEditorChange = (evt) => {
    setData(evt.editor.getData());
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
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={onEditorChange}
      />
      <Button style={buttonStyle} onClick={writeBoard} className="d-block w-100">
        저장하기
      </Button>
    </div>
  );
};

export default BoardWriteForm;