import "./Navigation.scss";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";

const Navigation = () => {
    const [query, setQuery] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = async () => {};

    const handlePressEnter = (event) => {
        if (event.code === "Enter") {
            setCurrentPage(1);
            handleSearch();
        }
    };

    return (
        <>
            <div className="header-top px-3 d-flex justify-content-end align-items-center">
                <span className="me-3" style={{color:"grey", fontSize: "14px"}}>Hi, username</span>
                <Dropdown>
                    <Dropdown.Toggle as="a" className="nav-help">Hỗ trợ</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={NavLink} to="/faq">FAQ</Dropdown.Item>
                        <Dropdown.Item as={NavLink} to="/about">About</Dropdown.Item>
                        <Dropdown.Item as={NavLink} to="/chatbot">Chatbot</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="nav-header">
                <Navbar bg="header" expand="lg" className="px-3">
                    <Container fluid className="d-flex justify-content-between align-items-center">
                        <Nav className="flex-grow-1 justify-content-start">
                            <NavLink to="/" exact className="nav-link px-3">
                                Trang chủ
                            </NavLink>
                            <Dropdown as="li">
                                <Dropdown.Toggle as="a" className="nav-link">Sản phẩm</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={NavLink} to="/product/category1">Category1</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/product/category2">Category2</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/product/category3">Category3</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <NavLink to="/event" exact className="nav-link px-3">
                                Sự kiện
                            </NavLink>
                        </Nav>
                        <div className="flex-grow-1 d-flex justify-content-center">
                            <div className="col-10 mx-auto text-center">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm sản phẩm"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(event) =>
                                            handlePressEnter(event)
                                        }
                                        style={{ borderColor: "white" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery("");
                                            setReloadTrigger((prev) => !prev);
                                        }}
                                        className="btn"
                                        hidden
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                    <button
                                        className="btn"
                                        style={{
                                            backgroundColor: "rgb(30, 66, 149)",
                                        }}
                                        onClick={() => {
                                            setCurrentPage(1);
                                            handleSearch();
                                        }}
                                    >
                                        <i
                                            className="fa fa-search"
                                            style={{ color: "white" }}
                                        ></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Nav className="flex-grow-1 justify-content-end">
                            <NavLink to="/cart" exact className="nav-link">
                                <i className="fa fa-shopping-cart fa-lg nav-icon"></i>
                            </NavLink>
                            <NavLink to="/notification" exact className="nav-link">
                                <i className="fa fa-bell-o fa-lg nav-icon"></i>
                            </NavLink>
                            <Dropdown as="li">
                                <Dropdown.Toggle as="a" className="nav-link">
                                    <i className="fa fa-user-circle-o fa-lg nav-icon"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item as={NavLink} to="/account"><i class="fa fa-cog nav-icon"></i>Tài khoản</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/order"><i class="fa fa-file-text-o nav-icon"></i>Đơn hàng</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/favourite"><i class="fa fa-heart-o nav-icon"></i>Yêu thích</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/"><i class="fa fa-sign-out nav-icon"></i>Đăng xuất</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
        </>
    );
};
export default Navigation;
