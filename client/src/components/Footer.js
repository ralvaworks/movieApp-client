import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
   return (
      <footer className="mt-auto py-4" style={{ 
         background: 'var(--primary-gradient)', 
         color: 'white'
      }}>
         <Container>
            <Row className="align-items-center">
               <Col md={6}>
                  <div className="d-flex align-items-center">
                     <i className="bi bi-film me-2" style={{ fontSize: '1.5rem' }}></i>
                     <div>
                        <h6 className="mb-0 fw-bold">MovieCatalog</h6>
                        <small className="opacity-75">Your ultimate movie companion</small>
                     </div>
                  </div>
               </Col>
               <Col md={6} className="text-md-end mt-3 mt-md-0">
                  <div className="d-flex justify-content-md-end align-items-center">
                     <small className="opacity-75 me-3">
                        © 2025 MovieCatalog. Built with ❤️
                     </small>
                     <div>
                        <i className="bi bi-github me-2" style={{ cursor: 'pointer' }}></i>
                        <i className="bi bi-twitter me-2" style={{ cursor: 'pointer' }}></i>
                        <i className="bi bi-linkedin" style={{ cursor: 'pointer' }}></i>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </footer>
   );
};

export default Footer;
