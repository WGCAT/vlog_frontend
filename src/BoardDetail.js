import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

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

  const deleteBoard = _id => {
    const send_param = { headers, _id };

    if (window.confirm("정말 삭제 하시겠습니까?")) {
      axios
        .post("http://localhost:8080/board/delete", send_param)
        .then(returnData => {
          alert("게시글이 삭제 되었습니다.");
          navigate("/");
        })
        .catch(err => {
          console.log(err);
          alert("글 삭제 실패");
        });
    }
  };

  const getDetail = () => {
    const send_param = {
      headers,
      _id: location.state._id
    };

    axios
      .post("http://localhost:8080/board/detail", send_param)
      .then(returnData => {
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
              <div>
                <Button
                  className="d-block w-100"
                  style={{ marginBottom: 5 }}
                  onClick={() =>
                    navigate("/boardWrite", {
                      state: {
                        title: boardData.title,
                        content: boardData.content,
                        _id: location.state._id
                      }
                    })
                  }
                >
                  글 수정
                </Button>
                <Button className="d-block w-100" onClick={() => deleteBoard(location.state._id)}>
                  글 삭제
                </Button>
              </div>
            </div>
          );
        } else {
          alert("글 상세 조회 실패");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return <div style={{ margin: 50 }}>{board}</div>;
};

export default BoardDetail;
