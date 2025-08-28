import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const MovieDetails = () => {
   const { movieId } = useParams();
   const { user } = useContext(UserContext);
   const [movie, setMovie] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [comment, setComment] = useState('');
   const [submitLoading, setSubmitLoading] = useState(false);

   const fetchMovie = useCallback(async () => {
      try {
         const response = await fetch(`${API_URL}/movies/${movieId}`, {
            method: 'GET',
            headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${user.token}`
            }
         });

         const data = await response.json();

         if (response.ok) {
            setMovie(data.movie);
            setError('');
         } else {
            setError(data.error || 'Failed to fetch movie details');
         }
      } catch (err) {
         setError('Network error. Please try again.');
         console.error('Error fetching movie:', err);
      } finally {
         setLoading(false);
      }
   }, [movieId, user.token]);

   useEffect(() => {
      fetchMovie();
   }, [fetchMovie]);

   const handleCommentSubmit = async (e) => {
      e.preventDefault();
      
      if (!comment.trim()) {
         setError('Please enter a comment');
         return;
      }

      setSubmitLoading(true);
      setError('');

      try {
         const response = await fetch(`${API_URL}/movies/${movieId}/comments`, {
            method: 'POST',
            headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ comment: comment.trim() })
         });

         const data = await response.json();

         if (response.ok) {
            setComment('');
            // Refresh movie data to get updated comments
            fetchMovie();
         } else {
            setError(data.error || 'Failed to add comment');
         }
      } catch (err) {
         setError('Network error. Please try again.');
         console.error('Error adding comment:', err);
      } finally {
         setSubmitLoading(false);
      }
   };

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      });
   };

   if (loading) {
      return (
         <Container className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading movie details...</p>
         </Container>
      );
   }

   if (!movie) {
      return (
         <Container className="py-5 text-center">
            <div className="text-muted">
               <i className="bi bi-exclamation-triangle" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
               <h4 className="mt-3">Movie Not Found</h4>
               <p>The movie you're looking for doesn't exist or has been removed.</p>
               <Button as={Link} to="/movies" className="btn-gradient-primary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Movies
               </Button>
            </div>
         </Container>
      );
   }

   return (
      <Container className="py-4">
         {/* Navigation */}
         <Row className="mb-4">
            <Col>
               <Button 
                  as={Link} 
                  to="/movies" 
                  variant="outline-secondary" 
                  size="sm"
                  className="mb-3"
               >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Movies
               </Button>
            </Col>
         </Row>

         {/* Movie Details */}
         <Row className="mb-5">
            <Col>
               <Card className="fitness-card border-0 fade-in">
                  <Card.Body className="p-4">
                     <Row>
                        <Col lg={8}>
                           <div className="mb-4">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                 <h1 className="text-gradient fw-bold mb-0">
                                    {movie.title}
                                 </h1>
                                 <Badge bg="primary" className="fs-6">
                                    {movie.year}
                                 </Badge>
                              </div>
                              
                              <div className="mb-3">
                                 <h5 className="text-muted mb-2">
                                    <i className="bi bi-person-video3 me-2"></i>
                                    Directed by {movie.director}
                                 </h5>
                                 <span className="badge" style={{ 
                                    background: 'var(--secondary-gradient)', 
                                    color: 'white',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    padding: '0.5rem 1rem'
                                 }}>
                                    <i className="bi bi-tags me-1"></i>
                                    {movie.genre}
                                 </span>
                              </div>
                           </div>

                           <div className="mb-4">
                              <h5 className="fw-bold mb-3">Description</h5>
                              <p className="text-muted lh-lg">
                                 {movie.description}
                              </p>
                           </div>
                        </Col>

                        <Col lg={4}>
                           <Card className="workout-card text-center">
                              <Card.Body>
                                 <div className="text-gradient mb-3">
                                    <i className="bi bi-film" style={{ fontSize: '3rem' }}></i>
                                 </div>
                                 <h6 className="fw-bold mb-3">Movie Stats</h6>
                                 <div className="d-flex justify-content-around">
                                    <div>
                                       <div className="stats-number text-gradient">
                                          {movie.comments?.length || 0}
                                       </div>
                                       <div className="stats-label">Comments</div>
                                    </div>
                                    <div>
                                       <div className="stats-number text-gradient">
                                          {movie.year}
                                       </div>
                                       <div className="stats-label">Release Year</div>
                                    </div>
                                 </div>
                              </Card.Body>
                           </Card>
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>

         {/* Comments Section */}
         <Row>
            <Col>
               <Card className="fitness-card border-0">
                  <Card.Body className="p-4">
                     <h4 className="text-gradient fw-bold mb-4">
                        <i className="bi bi-chat-dots me-2"></i>
                        Comments ({movie.comments?.length || 0})
                     </h4>

                     {/* Add Comment Form */}
                     <Form onSubmit={handleCommentSubmit} className="mb-4">
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-medium">Add a Comment</Form.Label>
                           <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Share your thoughts about this movie..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="form-control-modern"
                              maxLength={500}
                           />
                           <Form.Text className="text-muted">
                              {comment.length}/500 characters
                           </Form.Text>
                        </Form.Group>

                        {error && (
                           <Alert variant="danger" className="mb-3">
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              {error}
                           </Alert>
                        )}

                        <Button 
                           type="submit" 
                           className="btn-gradient-primary"
                           disabled={submitLoading || !comment.trim()}
                        >
                           {submitLoading ? (
                              <>
                                 <Spinner size="sm" className="me-2" />
                                 Adding Comment...
                              </>
                           ) : (
                              <>
                                 <i className="bi bi-chat-plus me-2"></i>
                                 Add Comment
                              </>
                           )}
                        </Button>
                     </Form>

                     {/* Comments List */}
                     <div className="mt-4">
                        {movie.comments && movie.comments.length > 0 ? (
                           movie.comments
                              .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                              .map((commentItem) => (
                                 <Card key={commentItem._id} className="workout-card mb-3">
                                    <Card.Body>
                                       <div className="d-flex justify-content-between align-items-start mb-2">
                                          <div className="d-flex align-items-center">
                                             <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                                  style={{ width: '40px', height: '40px' }}>
                                                <i className="bi bi-person text-white"></i>
                                             </div>
                                             <div>
                                                <h6 className="mb-0 fw-bold">
                                                   {commentItem.userId?.firstName} {commentItem.userId?.lastName}
                                                </h6>
                                                <small className="text-muted">
                                                   {formatDate(commentItem.dateAdded)}
                                                </small>
                                             </div>
                                          </div>
                                       </div>
                                       <p className="mb-0 text-muted ps-5">
                                          {commentItem.comment}
                                       </p>
                                    </Card.Body>
                                 </Card>
                              ))
                        ) : (
                           <div className="text-center py-4">
                              <div className="text-muted">
                                 <i className="bi bi-chat" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                 <h6 className="mt-3">No comments yet</h6>
                                 <p>Be the first to share your thoughts about this movie!</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
};

export default MovieDetails;
