import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BoardDetail = () => {
  const [board, setBoard] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state._id) {
      getDetail();
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  // 글 삭제
  const deleteBoard = (_id) => {
    const send_param = { _id };

    if (window.confirm("정말 삭제 하시겠습니까?")) {
      // axios
      axios
        .post("http://localhost:8080/board/delete", send_param)
        .then(() => {
          toast.success("게시글이 삭제되었습니다.");
          setTimeout(() => navigate("/"), 2000);
        })
        .catch((err) => {
          console.error(err);
          toast.error("글 삭제 실패. 다시 시도해주세요.");
        });
    }
  };

  // 글 상세
  const getDetail = () => {
    const send_param = { _id: location.state._id };

    // axios
    axios
      .post("http://localhost:8080/board/detail", send_param)
      .then((returnData) => {
        if (returnData.data.board[0]) {
          const boardData = returnData.data.board[0];
          setBoard(
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{boardData.title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td dangerouslySetInnerHTML={{ __html: boardData.content }}></td>
                  </tr>
                </tbody>
              </Table>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <NavLink
                  to="/boardUpdate"
                  state={{
                    title: boardData.title,
                    content: boardData.content,
                    // 해당 글의 ID 전달
                    _id: location.state._id,  
                  }}
                >
                  <Button style={{ width: "100px" }}>
                    글 수정
                  </Button>
                </NavLink>

                <Button
                  style={{ width: "100px" }}
                  onClick={() => deleteBoard(location.state._id)}
                >
                  글 삭제
                </Button>
              </div>
            </div>
          );
        } else {
          toast.error("글 상세 조회 실패.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("서버와의 통신 중 문제가 발생했습니다.");
      });
  };

  return (
    <div style={{ margin: 50 }}>
      <ToastContainer />
      {board}
    </div>
  );
};

export default BoardDetail;
