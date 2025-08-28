import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

import UserContext from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_BASE_URL;
const notyf = new Notyf();

const Login = () => {
   const [formData, setFormData] = useState({
      email: '',
      password: ''
   });
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const { setUser } = useContext(UserContext);
   const navigate = useNavigate();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
      // Clear specific error when user starts typing
      if (errors[name]) {
         setErrors(prev => ({
            ...prev,
            [name]: ''
         }));
      }
   };

   const validateForm = () => {
      const newErrors = {};

      if (!formData.email.trim()) {
         newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = 'Email format is invalid';
      }

      if (!formData.password) {
         newErrors.password = 'Password is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      setIsLoading(true);

      try {
         const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               email: formData.email,
               password: formData.password
            })
         });

         const data = await response.json();

         if (response.ok) {
            localStorage.setItem('token', data.access);
            setUser({
               id: data.user._id,
               isAdmin: data.user.isAdmin,
               token: data.access
            });
            notyf.success('Login successful!');
            navigate('/movies');
         } else {
            notyf.error(data.message || 'Login failed');
         }
      } catch (error) {
         console.error('Login error:', error);
         notyf.error('Network error. Please try again.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Container className="py-5">
         <Row className="justify-content-center">
            <Col md={6} lg={5}>
               <Card className="fitness-card border-0 fade-in">
                  <Card.Body className="p-5">
                     <div className="text-center mb-4">
                        <div className="text-gradient mb-3">
                           <i className="bi bi-box-arrow-in-right" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h2 className="text-gradient fw-bold">Welcome Back</h2>
                        <p className="text-muted">Sign in to access your movie catalog</p>
                     </div>

                     <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-medium">Email Address</Form.Label>
                           <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              className="form-control-modern"
                              isInvalid={!!errors.email}
                              required
                           />
                           <Form.Control.Feedback type="invalid">
                              {errors.email}
                           </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                           <Form.Label className="fw-medium">Password</Form.Label>
                           <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Enter your password"
                              className="form-control-modern"
                              isInvalid={!!errors.password}
                              required
                           />
                           <Form.Control.Feedback type="invalid">
                              {errors.password}
                           </Form.Control.Feedback>
                        </Form.Group>

                        <Button 
                           type="submit" 
                           className="btn-gradient-primary w-100 py-3 mb-3"
                           disabled={isLoading}
                        >
                           {isLoading ? (
                              <>
                                 <span className="spinner-border spinner-border-sm me-2" />
                                 Signing In...
                              </>
                           ) : (
                              <>
                                 <i className="bi bi-box-arrow-in-right me-2"></i>
                                 Sign In
                              </>
                           )}
                        </Button>

                        <div className="text-center">
                           <span className="text-muted">Don't have an account? </span>
                           <Link to="/register" className="text-decoration-none fw-medium">
                              Create Account
                           </Link>
                        </div>
                     </Form>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   )
}

export default Login;