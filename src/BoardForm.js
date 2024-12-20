import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const BoardRow = ({ _id, createdAt, title }) => {
  return (
    <tr>
      <td>
        <NavLink
          to={{ pathname: "/board/detail", state: { _id } }}
        >
          {createdAt.substring(0, 10)}
        </NavLink>
      </td>
      <td>
        <NavLink
          to={{ pathname: "/board/detail", state: { _id } }}
        >
          {title}
        </NavLink>
      </td>
    </tr>
  );
};

const BoardForm = () => {
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    getBoardList();
  }, []);

  const getBoardList = () => {
    const send_param = {
      headers,
      _id: $.cookie("login_id"),
    };

    axios
      .post("http://localhost:8080/board/getBoardList", send_param)
      .then((returnData) => {
        // 데이터 검증 추가
        if (returnData?.data?.list?.length > 0) {
          const boards = returnData.data.list;
          const boardRows = boards.map((item) => (
            <BoardRow
              key={item._id}
              _id={item._id}
              createdAt={item.createdAt}
              title={item.title}
            />
          ));
          setBoardList(boardRows);
        } else {
          // 게시글이 없을 때
          setBoardList(
            <tr>
              <td colSpan="2">작성한 게시글이 존재하지 않습니다.</td>
            </tr>
          );
        }
      })
      .catch((err) => {
        console.log("Error fetching board list:", err);
        // 에러 발생 시 기본값 설정
        setBoardList(
          <tr>
            <td colSpan="2">게시글을 불러오는 중 문제가 발생했습니다.</td>
          </tr>
        );
      });
  };

  const divStyle = {
    margin: 50,
  };

  return (
    <div>
      <div style={divStyle}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>날짜</th>
              <th>글 제목</th>
            </tr>
          </thead>
          <tbody>{boardList}</tbody>
        </Table>
      </div>
    </div>
  );
};

export default BoardForm;
