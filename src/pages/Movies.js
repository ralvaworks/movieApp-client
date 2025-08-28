import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const Movies = () => {
   const { user } = useContext(UserContext);
   const [movies, setMovies] = useState([]);
   const [filteredMovies, setFilteredMovies] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedGenre, setSelectedGenre] = useState('');

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

   const filterMovies = useCallback(() => {
      let filtered = movies;

      if (searchTerm) {
         filtered = filtered.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchTerm.toLowerCase())
         );
      }

      if (selectedGenre) {
         filtered = filtered.filter(movie => 
            movie.genre.toLowerCase() === selectedGenre.toLowerCase()
         );
      }

      setFilteredMovies(filtered);
   }, [movies, searchTerm, selectedGenre]);

   useEffect(() => {
      fetchMovies();
   }, [fetchMovies]);

   useEffect(() => {
      filterMovies();
   }, [filterMovies]);

   const getUniqueGenres = () => {
      const genres = movies.map(movie => movie.genre);
      return [...new Set(genres)].sort();
   };

   if (loading) {
      return (
         <Container className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading movies...</p>
         </Container>
      );
   }

   return (
      <Container className="py-4">
         {/* Header */}
         <Row className="mb-4">
            <Col>
               <h1 className="text-gradient fw-bold mb-2">
                  <i className="bi bi-collection-play me-2"></i>
                  Movie Catalog
               </h1>
               <p className="text-muted lead">Discover and explore amazing movies</p>
            </Col>
         </Row>

         {/* Search and Filter */}
         <Row className="mb-4">
            <Col md={8}>
               <InputGroup>
                  <InputGroup.Text>
                     <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                     type="text"
                     placeholder="Search movies by title, director, or description..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="form-control-modern"
                  />
               </InputGroup>
            </Col>
            <Col md={4}>
               <Form.Select 
                  value={selectedGenre} 
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="form-control-modern"
               >
                  <option value="">All Genres</option>
                  {getUniqueGenres().map(genre => (
                     <option key={genre} value={genre}>{genre}</option>
                  ))}
               </Form.Select>
            </Col>
         </Row>

         {/* Error Alert */}
         {error && (
            <Alert variant="danger" className="mb-4">
               <i className="bi bi-exclamation-triangle me-2"></i>
               {error}
            </Alert>
         )}

         {/* Movies Grid */}
         {filteredMovies.length === 0 && !loading ? (
            <Row>
               <Col className="text-center py-5">
                  <div className="text-muted">
                     <i className="bi bi-film" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                     <h4 className="mt-3">No movies found</h4>
                     <p>Try adjusting your search criteria or check back later.</p>
                  </div>
               </Col>
            </Row>
         ) : (
            <Row className="g-4">
               {filteredMovies.map((movie) => (
                  <Col key={movie._id} md={6} lg={4}>
                     <Card className="fitness-card h-100 hover-lift fade-in">
                        <Card.Body className="d-flex flex-column">
                           <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                 <Card.Title className="h5 mb-0 text-gradient">
                                    {movie.title}
                                 </Card.Title>
                                 <span className="badge bg-primary rounded-pill">
                                    {movie.year}
                                 </span>
                              </div>
                              <Card.Subtitle className="text-muted mb-2">
                                 <i className="bi bi-person-video3 me-1"></i>
                                 {movie.director}
                              </Card.Subtitle>
                              <span className="badge" style={{ 
                                 background: 'var(--primary-gradient)', 
                                 color: 'white',
                                 borderRadius: '20px',
                                 fontSize: '0.8rem'
                              }}>
                                 {movie.genre}
                              </span>
                           </div>

                           <Card.Text className="flex-grow-1 text-muted">
                              {movie.description.length > 150 
                                 ? `${movie.description.substring(0, 150)}...` 
                                 : movie.description
                              }
                           </Card.Text>

                           <div className="d-flex justify-content-between align-items-center mt-3">
                              <div className="text-muted small">
                                 <i className="bi bi-chat-dots me-1"></i>
                                 {movie.comments?.length || 0} comments
                              </div>
                              <Button 
                                 as={Link} 
                                 to={`/movies/${movie._id}`}
                                 className="btn-gradient-primary btn-sm"
                              >
                                 View Movie
                              </Button>
                           </div>
                        </Card.Body>
                     </Card>
                  </Col>
               ))}
            </Row>
         )}

         {/* Results Count */}
         {!loading && (
            <Row className="mt-4">
               <Col className="text-center">
                  <p className="text-muted">
                     Showing {filteredMovies.length} of {movies.length} movies
                  </p>
               </Col>
            </Row>
         )}
      </Container>
   );
};

export default Movies;
