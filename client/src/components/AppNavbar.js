import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
   const { user, unsetUser } = useContext(UserContext);
   const navigate = useNavigate();

   const handleLogout = () => {
      unsetUser();
      navigate('/');
   };

   return (
      <Navbar expand="lg" className="navbar-fitness sticky-top">
         <Container>
            <Navbar.Brand as={Link} to="/" className="navbar-brand-fitness">
               <i className="bi bi-film me-2"></i>
               MovieCatalog
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                  <Nav.Link as={Link} to="/" className="fw-medium">
                     <i className="bi bi-house me-1"></i>
                     Home
                  </Nav.Link>
                  
                  {user.id && (
                     <Nav.Link as={Link} to="/movies" className="fw-medium">
                        <i className="bi bi-collection-play me-1"></i>
                        Movies
                     </Nav.Link>
                  )}
                  
                  {user.isAdmin && (
                     <Nav.Link as={Link} to="/admin/dashboard" className="fw-medium">
                        <i className="bi bi-speedometer2 me-1"></i>
                        Admin Dashboard
                     </Nav.Link>
                  )}
               </Nav>
               
               <Nav className="ms-auto">
                  {user.id ? (
                     <Dropdown align="end">
                        <Dropdown.Toggle 
                           variant="outline-primary" 
                           id="dropdown-basic"
                           className="d-flex align-items-center"
                        >
                           <i className="bi bi-person-circle me-2"></i>
                           Account
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                           <Dropdown.Item as={Link} to="/profile">
                              <i className="bi bi-person me-2"></i>
                              Profile
                           </Dropdown.Item>
                           <Dropdown.Divider />
                           <Dropdown.Item onClick={handleLogout}>
                              <i className="bi bi-box-arrow-right me-2"></i>
                              Logout
                           </Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                  ) : (
                     <>
                        <Nav.Link as={Link} to="/login" className="me-2">
                           <Button variant="outline-primary" size="sm">
                              <i className="bi bi-box-arrow-in-right me-1"></i>
                              Login
                           </Button>
                        </Nav.Link>
                        <Nav.Link as={Link} to="/register">
                           <Button variant="primary" size="sm" className="btn-gradient-primary">
                              <i className="bi bi-person-plus me-1"></i>
                              Register
                           </Button>
                        </Nav.Link>
                     </>
                  )}
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   )
}

export default AppNavbar;