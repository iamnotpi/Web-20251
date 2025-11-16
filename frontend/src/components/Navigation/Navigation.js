import './Navigation.scss';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import bell from '../../static/bell.png';
import cart from '../../static/shopping-cart.png';
import { productCategories } from '../../data/mockProducts';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const navigateToProducts = (params) => {
    const search = params.toString();
    navigate(search ? `/products?${search}` : '/products');
    setShowOffcanvas(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('search', query.trim());
    }
    navigateToProducts(params);
  };

  const handleSelectCategory = (category) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('search', query.trim());
    }
    if (category && category !== 'All') {
      params.set('category', category);
    }
    navigateToProducts(params);
  };

  const handlePressEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <>
      <div className="header-top px-3 justify-content-end align-items-center d-none d-lg-flex">
        <span className="" style={{ color: 'grey', fontSize: '14px' }}>
          Hi, username
        </span>
        <Dropdown>
          <Dropdown.Toggle className="nav-help">Hỗ trợ</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/faq">
              FAQ
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/about">
              About
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/chatbot">
              Chatbot
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="nav-header">
        <Navbar bg="header" className="px-3">
          <Container fluid className="d-flex justify-content-between align-items-center">
            <span className="d-lg-none" style={{ margin: '2vw' }} onClick={handleShowOffcanvas}>
              <i className="fa fa-th" style={{ color: 'rgba(66, 66, 66, 1)' }}></i>
            </span>
            <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} className="d-lg-none">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Hi, username</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-grow-1 justify-content-start">
                  <NavLink to="/" className="nav-link px-2" onClick={handleCloseOffcanvas}>
                    Trang chủ
                  </NavLink>
                  <Dropdown as="li">
                    <Dropdown.Toggle as="a" className="nav-link px-2">
                      Sản phẩm
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleSelectCategory('All')}>
                        Tất cả sản phẩm
                      </Dropdown.Item>
                      {productCategories.map((category) => (
                        <Dropdown.Item key={category} onClick={() => handleSelectCategory(category)}>
                          {category}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <NavLink to="/event" className="nav-link px-2" onClick={handleCloseOffcanvas}>
                    Sự kiện
                  </NavLink>
                  <Dropdown as="li">
                    <Dropdown.Toggle as="a" className="nav-link px-2">
                      Hỗ trợ
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={NavLink} to="/faq" onClick={handleCloseOffcanvas}>
                        FAQ
                      </Dropdown.Item>
                      <Dropdown.Item as={NavLink} to="/about" onClick={handleCloseOffcanvas}>
                        About
                      </Dropdown.Item>
                      <Dropdown.Item as={NavLink} to="/chatbot" onClick={handleCloseOffcanvas}>
                        Chatbot
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
            <Nav className="flex-grow-1 justify-content-start d-none d-lg-flex">
              <NavLink to="/" className="nav-link px-3">
                Trang chủ
              </NavLink>
              <Dropdown as="li">
                <Dropdown.Toggle as="a" className="nav-link px-3">
                  Sản phẩm
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSelectCategory('All')}>
                    Tất cả sản phẩm
                  </Dropdown.Item>
                  {productCategories.map((category) => (
                    <Dropdown.Item key={category} onClick={() => handleSelectCategory(category)}>
                      {category}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <NavLink to="/event" className="nav-link px-3">
                Sự kiện
              </NavLink>
            </Nav>

            <div className="flex-grow-1 d-flex justify-content-center">
              <div className="col-12 mx-auto text-center">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handlePressEnter}
                    style={{ borderColor: 'white' }}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="btn"
                      aria-label="Clear search"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  )}
                  <button
                    className="btn"
                    type="button"
                    style={{ backgroundColor: 'rgb(30, 66, 149)' }}
                    onClick={handleSearch}
                  >
                    <i className="fa fa-search" style={{ color: 'white' }}></i>
                  </button>
                </div>
              </div>
            </div>
            <Nav className="flex-grow-1 justify-content-end">
              <NavLink to="/cart" className="nav-link">
                <img
                  src={cart}
                  style={{ width: '26px', height: '26px' }}
                  className="mx-auto"
                  alt="Shopping cart"
                />
              </NavLink>
              <NavLink to="/notification" className="nav-link">
                <img
                  src={bell}
                  style={{ width: '28px', height: '28px' }}
                  className="mx-auto"
                  alt="Notification"
                />
              </NavLink>
              <Dropdown as="li">
                <Dropdown.Toggle as="a" className="nav-link">
                  <i className="fa fa-user-circle fa-lg" style={{ color: 'rgba(66, 66, 66, 1)' }}></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={NavLink} to="/account">
                    <i className="fa fa-cog nav-item" /> Hồ sơ
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/order">
                    <i className="fa fa-file-text-o nav-item" /> Đơn hàng
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/favourite">
                    <i className="fa fa-heart-o nav-item" /> Yêu thích
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/">
                    <i className="fa fa-sign-out nav-item" /> Đăng xuất
                  </Dropdown.Item>
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
