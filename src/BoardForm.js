import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

// BoardRow 컴포넌트
class BoardRow extends Component {
  render() {
    const { _id, createdAt, title } = this.props;
    return (
      <tr>
        <td>
          <NavLink to="/board/detail" state={{ _id }}>
            {createdAt.substring(0, 10)}
          </NavLink>
        </td>
        <td>
          <NavLink to="/board/detail" state={{ _id }}>
            {title}
          </NavLink>
        </td>
      </tr>
    );
  }
}

// BoardForm 컴포넌트
class BoardForm extends Component {
  state = {
    boardList: [],
  };

  componentDidMount() {
    this.getBoardList();
  }

  getBoardList = () => {
    const send_param = {
      headers,
      _id: $.cookie("login_id"),
    };

    axios
      .post("http://localhost:8080/board/getBoardList", send_param)
      .then((returnData) => {
        // 서버에서 데이터 확인
        console.log("Board List Data:", returnData.data);

        if (returnData.data.list && returnData.data.list.length > 0) {
          const boards = returnData.data.list;
          const boardList = boards.map((item) => (
            <BoardRow
              key={item._id} // 고유 키로 _id 사용
              _id={item._id}
              createdAt={item.createdAt}
              title={item.title}
            />
          ));
          this.setState({ boardList });
        } else {
          // 게시글이 없는 경우
          this.setState({
            boardList: (
              <tr>
                <td colSpan="2">작성한 게시글이 존재하지 않습니다.</td>
              </tr>
            ),
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching board list:", err);
        // 에러 처리
        this.setState({
          boardList: (
            <tr>
              <td colSpan="2">게시글을 불러오는 중 문제가 발생했습니다.</td>
            </tr>
          ),
        });
      });
  };

  render() {
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
            <tbody>{this.state.boardList}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default BoardForm;
