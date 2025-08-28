import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import UserContext from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const AdminDashboard = () => {
   const { user } = useContext(UserContext);
   const [movies, setMovies] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [editingMovie, setEditingMovie] = useState(null);
   const [submitLoading, setSubmitLoading] = useState(false);
   
   // Form state
   const [formData, setFormData] = useState({
      title: '',
      director: '',
      year: '',
      description: '',
      genre: ''
   });

   const fetchMovies = useCallback(async () => {
      try {
         const response = await fetch(`${API_URL}/movies`, {
            method: 'GET',
            headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${user.token}`
            }
         });

         const data = await response.json();

         if (response.ok) {
            setMovies(data.movies);
            setError('');
         } else {
            setError(data.error || 'Failed to fetch movies');
         }
      } catch (err) {
         setError('Network error. Please try again.');
         console.error('Error fetching movies:', err);
      } finally {
         setLoading(false);
      }
   }, [user.token]);

   useEffect(() => {
      fetchMovies();
   }, [fetchMovies]);

   const resetForm = () => {
      setFormData({
         title: '',
         director: '',
         year: '',
         description: '',
         genre: ''
      });
      setEditingMovie(null);
      setError('');
   };

   const handleShowModal = (movie = null) => {
      if (movie) {
         setEditingMovie(movie);
         setFormData({
            title: movie.title,
            director: movie.director,
            year: movie.year.toString(),
            description: movie.description,
            genre: movie.genre
         });
      } else {
         resetForm();
      }
      setShowModal(true);
   };

   const handleCloseModal = () => {
      setShowModal(false);
      resetForm();
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validation
      if (!formData.title.trim() || !formData.director.trim() || !formData.year || 
          !formData.description.trim() || !formData.genre.trim()) {
         setError('All fields are required');
         return;
      }

      const year = parseInt(formData.year);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 5) {
         setError('Please enter a valid year');
         return;
      }

      setSubmitLoading(true);
      setError('');

      try {
         const url = editingMovie 
            ? `${API_URL}/movies/${editingMovie._id}`
            : `${API_URL}/movies`;
         
         const method = editingMovie ? 'PATCH' : 'POST';

         const response = await fetch(url, {
            method: method,
            headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
               title: formData.title.trim(),
               director: formData.director.trim(),
               year: year,
               description: formData.description.trim(),
               genre: formData.genre.trim()
            })
         });

         const data = await response.json();

         if (response.ok) {
            handleCloseModal();
            fetchMovies(); // Refresh the movies list
         } else {
            setError(data.error || `Failed to ${editingMovie ? 'update' : 'add'} movie`);
         }
      } catch (err) {
         setError('Network error. Please try again.');
         console.error('Error submitting movie:', err);
      } finally {
         setSubmitLoading(false);
      }
   };

   const handleDelete = async (movieId) => {
      if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
         return;
      }

      try {
         const response = await fetch(`${API_URL}/movies/${movieId}`, {
            method: 'DELETE',
            headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${user.token}`
            }
         });

         const data = await response.json();

         if (response.ok) {
            fetchMovies(); // Refresh the movies list
         } else {
            setError(data.error || 'Failed to delete movie');
         }
      } catch (err) {
         setError('Network error. Please try again.');
         console.error('Error deleting movie:', err);
      }
   };

   if (loading) {
      return (
         <Container className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading dashboard...</p>
         </Container>
      );
   }

   return (
      <Container className="py-4">
         {/* Header */}
         <Row className="mb-4">
            <Col>
               <Card className="fitness-card border-0">
                  <Card.Body className="p-4">
                     <div className="d-flex justify-content-between align-items-center">
                        <div>
                           <h1 className="text-gradient fw-bold mb-2">
                              <i className="bi bi-speedometer2 me-2"></i>
                              Admin Dashboard
                           </h1>
                           <p className="text-muted mb-0">Manage movies and monitor platform activity</p>
                        </div>
                        <Button 
                           id="addMovie"
                           className="btn-gradient-primary"
                           onClick={() => handleShowModal()}
                        >
                           <i className="bi bi-plus-circle me-2"></i>
                           Add Movie
                        </Button>
                     </div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Stats Cards */}
         <Row className="mb-4 g-4">
            <Col md={3}>
               <Card className="stats-card hover-lift">
                  <Card.Body>
                     <div className="stats-number">{movies.length}</div>
                     <div className="stats-label">Total Movies</div>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={3}>
               <Card className="stats-card hover-lift">
                  <Card.Body>
                     <div className="stats-number">
                        {movies.reduce((total, movie) => total + (movie.comments?.length || 0), 0)}
                     </div>
                     <div className="stats-label">Total Comments</div>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={3}>
               <Card className="stats-card hover-lift">
                  <Card.Body>
                     <div className="stats-number">
                        {[...new Set(movies.map(movie => movie.genre))].length}
                     </div>
                     <div className="stats-label">Genres</div>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={3}>
               <Card className="stats-card hover-lift">
                  <Card.Body>
                     <div className="stats-number">
                        {movies.length > 0 ? Math.round(movies.reduce((sum, movie) => sum + movie.year, 0) / movies.length) : 0}
                     </div>
                     <div className="stats-label">Avg. Year</div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Error Alert */}
         {error && (
            <Alert variant="danger" className="mb-4">
               <i className="bi bi-exclamation-triangle me-2"></i>
               {error}
            </Alert>
         )}

         {/* Movies Table */}
         <Row>
            <Col>
               <Card className="fitness-card border-0">
                  <Card.Body className="p-0">
                     <div className="p-4 border-bottom">
                        <h4 className="text-gradient fw-bold mb-0">
                           <i className="bi bi-table me-2"></i>
                           Movies Management
                        </h4>
                     </div>
                     
                     {movies.length === 0 ? (
                        <div className="text-center py-5">
                           <div className="text-muted">
                              <i className="bi bi-film" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                              <h5 className="mt-3">No movies yet</h5>
                              <p>Add your first movie to get started!</p>
                              <Button 
                                 className="btn-gradient-primary"
                                 onClick={() => handleShowModal()}
                              >
                                 <i className="bi bi-plus-circle me-2"></i>
                                 Add Movie
                              </Button>
                           </div>
                        </div>
                     ) : (
                        <div className="table-responsive">
                           <Table hover className="mb-0">
                              <thead style={{ background: 'var(--primary-gradient)' }}>
                                 <tr>
                                    <th className="text-white fw-bold">Title</th>
                                    <th className="text-white fw-bold">Director</th>
                                    <th className="text-white fw-bold">Year</th>
                                    <th className="text-white fw-bold">Genre</th>
                                    <th className="text-white fw-bold">Comments</th>
                                    <th className="text-white fw-bold">Actions</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {movies.map((movie) => (
                                    <tr key={movie._id}>
                                       <td className="fw-medium">{movie.title}</td>
                                       <td className="text-muted">{movie.director}</td>
                                       <td>
                                          <Badge bg="primary">{movie.year}</Badge>
                                       </td>
                                       <td>
                                          <Badge 
                                             style={{ 
                                                background: 'var(--secondary-gradient)', 
                                                color: 'white' 
                                             }}
                                          >
                                             {movie.genre}
                                          </Badge>
                                       </td>
                                       <td>
                                          <span className="text-muted">
                                             <i className="bi bi-chat-dots me-1"></i>
                                             {movie.comments?.length || 0}
                                          </span>
                                       </td>
                                       <td>
                                          <div className="d-flex gap-2">
                                             <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                onClick={() => handleShowModal(movie)}
                                             >
                                                <i className="bi bi-pencil"></i>
                                             </Button>
                                             <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(movie._id)}
                                             >
                                                <i className="bi bi-trash"></i>
                                             </Button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </Table>
                        </div>
                     )}
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Add/Edit Movie Modal */}
         <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton style={{ background: 'var(--primary-gradient)' }}>
               <Modal.Title className="text-white">
                  <i className="bi bi-film me-2"></i>
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
               <Form onSubmit={handleSubmit}>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-medium">Title *</Form.Label>
                           <Form.Control
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Enter movie title"
                              className="form-control-modern"
                              maxLength={100}
                              required
                           />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-medium">Director *</Form.Label>
                           <Form.Control
                              type="text"
                              name="director"
                              value={formData.director}
                              onChange={handleInputChange}
                              placeholder="Enter director name"
                              className="form-control-modern"
                              maxLength={50}
                              required
                           />
                        </Form.Group>
                     </Col>
                  </Row>

                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-medium">Release Year *</Form.Label>
                           <Form.Control
                              type="number"
                              name="year"
                              value={formData.year}
                              onChange={handleInputChange}
                              placeholder="e.g., 2023"
                              className="form-control-modern"
                              min={1900}
                              max={new Date().getFullYear() + 5}
                              required
                           />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-medium">Genre *</Form.Label>
                           <Form.Control
                              type="text"
                              name="genre"
                              value={formData.genre}
                              onChange={handleInputChange}
                              placeholder="e.g., Action, Drama, Comedy"
                              className="form-control-modern"
                              maxLength={30}
                              required
                           />
                        </Form.Group>
                     </Col>
                  </Row>

                  <Form.Group className="mb-3">
                     <Form.Label className="fw-medium">Description *</Form.Label>
                     <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter movie description..."
                        className="form-control-modern"
                        maxLength={1000}
                        required
                     />
                     <Form.Text className="text-muted">
                        {formData.description.length}/1000 characters
                     </Form.Text>
                  </Form.Group>

                  {error && (
                     <Alert variant="danger" className="mb-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                     </Alert>
                  )}
               </Form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="outline-secondary" onClick={handleCloseModal}>
                  Cancel
               </Button>
               <Button 
                  type="submit" 
                  className="btn-gradient-primary"
                  disabled={submitLoading}
                  onClick={handleSubmit}
               >
                  {submitLoading ? (
                     <>
                        <Spinner size="sm" className="me-2" />
                        {editingMovie ? 'Updating...' : 'Adding...'}
                     </>
                  ) : (
                     <>
                        <i className={`bi ${editingMovie ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                        {editingMovie ? 'Update Movie' : 'Add Movie'}
                     </>
                  )}
               </Button>
            </Modal.Footer>
         </Modal>
      </Container>
   );
};

export default AdminDashboard;
