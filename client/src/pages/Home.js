import React, { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

const Home = () => {
   const { user } = useContext(UserContext);

   return (
      <>
         {/* Hero Section */}
         <section className="hero-section">
            <Container>
               <div className="hero-content text-center fade-in">
                  <h1 className="display-4 fw-bold mb-4">
                     Discover Amazing Movies
                  </h1>
                  <p className="lead mb-4 opacity-90">
                     Explore our curated collection of films, read reviews, and share your thoughts with the community.
                  </p>
                  {!user.id ? (
                     <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button 
                           as={Link} 
                           to="/register" 
                           size="lg" 
                           className="btn-gradient-primary px-4 py-2"
                        >
                           <i className="bi bi-person-plus me-2"></i>
                           Get Started
                        </Button>
                        <Button 
                           as={Link} 
                           to="/login" 
                           variant="outline-light" 
                           size="lg" 
                           className="px-4 py-2"
                        >
                           <i className="bi bi-box-arrow-in-right me-2"></i>
                           Sign In
                        </Button>
                     </div>
                  ) : (
                     <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button 
                           as={Link} 
                           to="/movies" 
                           size="lg" 
                           className="btn-gradient-primary px-4 py-2"
                        >
                           <i className="bi bi-collection-play me-2"></i>
                           Browse Movies
                        </Button>
                        {user.isAdmin && (
                           <Button 
                              as={Link} 
                              to="/admin/dashboard" 
                              variant="outline-light" 
                              size="lg" 
                              className="px-4 py-2"
                           >
                              <i className="bi bi-speedometer2 me-2"></i>
                              Admin Dashboard
                           </Button>
                        )}
                     </div>
                  )}
               </div>
            </Container>
         </section>

         {/* Features Section */}
         <Container className="py-5">
            <Row className="text-center mb-5">
               <Col>
                  <h2 className="text-gradient fw-bold mb-3">Why Choose MovieCatalog?</h2>
                  <p className="text-muted lead">Discover what makes our platform special</p>
               </Col>
            </Row>

            <Row className="g-4">
               <Col md={4}>
                  <Card className="fitness-card h-100 text-center border-0 hover-lift">
                     <Card.Body className="p-4">
                        <div className="text-gradient mb-3">
                           <i className="bi bi-collection-play" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <Card.Title className="h4 mb-3">Extensive Collection</Card.Title>
                        <Card.Text className="text-muted">
                           Browse through our carefully curated collection of movies from various genres and time periods.
                        </Card.Text>
                     </Card.Body>
                  </Card>
               </Col>

               <Col md={4}>
                  <Card className="fitness-card h-100 text-center border-0 hover-lift">
                     <Card.Body className="p-4">
                        <div className="text-gradient mb-3">
                           <i className="bi bi-chat-dots" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <Card.Title className="h4 mb-3">Community Reviews</Card.Title>
                        <Card.Text className="text-muted">
                           Read and share reviews with fellow movie enthusiasts. Join the conversation about your favorite films.
                        </Card.Text>
                     </Card.Body>
                  </Card>
               </Col>

               <Col md={4}>
                  <Card className="fitness-card h-100 text-center border-0 hover-lift">
                     <Card.Body className="p-4">
                        <div className="text-gradient mb-3">
                           <i className="bi bi-person-check" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <Card.Title className="h4 mb-3">User-Friendly</Card.Title>
                        <Card.Text className="text-muted">
                           Easy registration and intuitive interface designed for the best user experience across all devices.
                        </Card.Text>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>

         {/* Stats Section */}
         {user.id && (
            <section className="py-5" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
               <Container>
                  <Row className="text-center">
                     <Col>
                        <h3 className="text-gradient fw-bold mb-4">Welcome back!</h3>
                        <p className="text-muted mb-4">
                           Ready to discover your next favorite movie?
                        </p>
                        <Button 
                           as={Link} 
                           to="/movies" 
                           size="lg" 
                           className="btn-gradient-primary"
                        >
                           <i className="bi bi-arrow-right-circle me-2"></i>
                           Start Browsing
                        </Button>
                     </Col>
                  </Row>
               </Container>
            </section>
         )}
      </>
   )
}

export default Home;