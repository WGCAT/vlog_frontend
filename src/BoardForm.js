import React, { Component } from "react";
import { Table, Pagination } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardRow extends Component {
  render() {
    const { _id, createdAt, title } = this.props;
    return (
      <tr>
        <td style={{ textAlign: "left" }}>
          <NavLink to="/board/detail" state={{ _id }}>
            {createdAt.substring(0, 10)}
          </NavLink>
        </td>
        <td style={{ textAlign: "left" }}>
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
    // 전체 게시글 리스트
    boardList: [], 
    currentPage: 1,
    postsPerPage: 10,
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
          this.setState({ boardList: returnData.data.list });
        } else {
          // 게시글 없는 경우
          this.setState({
            boardList: [],
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching board list:", err);
        this.setState({
          boardList: [],
        });
      });
  };

  // 현재 페이지 설정
  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { boardList, currentPage, postsPerPage } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = boardList.slice(indexOfFirstPost, indexOfLastPost);

    const divStyle = {
      margin: 50,
      textAlign: "center",
    };

    // 페이지 버튼 생성
    const totalPages = Math.ceil(boardList.length / postsPerPage);
    const paginationItems = [];

    // 게시글이 10개 이하일 경우, 페이지네이션은 1개만 표시
    if (boardList.length <= postsPerPage) {
      paginationItems.push(
        <Pagination.Item
          key={1}
          active={currentPage === 1}
          onClick={() => this.handlePageChange(1)}
        >
          1
        </Pagination.Item>
      );
    } else {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => this.handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    return (
      <div>
        <div style={divStyle}>
          <Table striped bordered hover style={{ width: "600px", margin: "0 auto" }}>
            <thead>
              <tr>
                <th style={{ width: "300px", textAlign: "left" }}>날짜</th>
                <th style={{ width: "300px", textAlign: "left" }}>글 제목</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.length > 0 ? (
                currentPosts.map((item) => (
                  <BoardRow
                    // 고유 키 : _id
                    key={item._id} 
                    _id={item._id}
                    createdAt={item.createdAt}
                    title={item.title}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="2">작성한 게시글이 존재하지 않습니다.</td>
                </tr>
              )}
            </tbody>
          </Table>
          {boardList.length > 0 && (
            <Pagination className="justify-content-center" style={{ marginTop: "50px" }}>
              {paginationItems}
            </Pagination>
          )}
        </div>
      </div>
    );
  }
}

export default BoardForm;
