import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;
const notyf = new Notyf();

const Register = () => {
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
   });
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({});
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

      if (!formData.firstName.trim()) {
         newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName.trim()) {
         newErrors.lastName = 'Last name is required';
      }

      if (!formData.email.trim()) {
         newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = 'Email format is invalid';
      }

      if (!formData.password) {
         newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
         newErrors.password = 'Password must be at least 8 characters';
      }

      if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = 'Passwords do not match';
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
         const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               password: formData.password
            })
         });

         const data = await response.json();

         if (response.ok) {
            notyf.success('Registration successful! Please log in.');
            navigate('/login');
         } else {
            notyf.error(data.error || 'Registration failed');
         }
      } catch (error) {
         console.error('Registration error:', error);
         notyf.error('Network error. Please try again.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Container className="py-5">
         <Row className="justify-content-center">
            <Col md={8} lg={6}>
               <Card className="fitness-card border-0 fade-in">
                  <Card.Body className="p-5">
                     <div className="text-center mb-4">
                        <div className="text-gradient mb-3">
                           <i className="bi bi-person-plus" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h2 className="text-gradient fw-bold">Create Account</h2>
                        <p className="text-muted">Join our movie community today!</p>
                     </div>

                     <Form onSubmit={handleSubmit}>
                        <Row>
                           <Col md={6}>
                              <Form.Group className="mb-3">
                                 <Form.Label className="fw-medium">First Name</Form.Label>
                                 <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    className="form-control-modern"
                                    isInvalid={!!errors.firstName}
                                    required
                                 />
                                 <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                 </Form.Control.Feedback>
                              </Form.Group>
                           </Col>
                           <Col md={6}>
                              <Form.Group className="mb-3">
                                 <Form.Label className="fw-medium">Last Name</Form.Label>
                                 <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                    className="form-control-modern"
                                    isInvalid={!!errors.lastName}
                                    required
                                 />
                                 <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                 </Form.Control.Feedback>
                              </Form.Group>
                           </Col>
                        </Row>

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

                        <Form.Group className="mb-3">
                           <Form.Label className="fw-medium">Password</Form.Label>
                           <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Create a password"
                              className="form-control-modern"
                              isInvalid={!!errors.password}
                              required
                           />
                           <Form.Control.Feedback type="invalid">
                              {errors.password}
                           </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                           <Form.Label className="fw-medium">Confirm Password</Form.Label>
                           <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm your password"
                              className="form-control-modern"
                              isInvalid={!!errors.confirmPassword}
                              required
                           />
                           <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
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
                                 Creating Account...
                              </>
                           ) : (
                              <>
                                 <i className="bi bi-person-check me-2"></i>
                                 Create Account
                              </>
                           )}
                        </Button>

                        <div className="text-center">
                           <span className="text-muted">Already have an account? </span>
                           <Link to="/login" className="text-decoration-none fw-medium">
                              Sign In
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

export default Register;