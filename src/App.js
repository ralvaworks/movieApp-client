import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDetails from './pages/UserDetails';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import AdminDashboard from './pages/AdminDashboard';

import AppNavbar from './components/AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

import { UserProvider } from './context/UserContext';

const App = () => {
   return (
      <UserProvider>
         <Router>
            <div className="d-flex flex-column min-vh-100">
               <AppNavbar />
               <main className="flex-grow-1">
                  <Routes>
                     <Route path="/" element={<Home />} />
                     <Route path="/register" element={<Register />} />
                     <Route path="/login" element={<Login />} />
                     <Route path="/movies" element={
                        <ProtectedRoute>
                           <Movies />
                        </ProtectedRoute>
                     } />
                     <Route path="/movies/:movieId" element={
                        <ProtectedRoute>
                           <MovieDetails />
                        </ProtectedRoute>
                     } />
                     <Route path="/admin/dashboard" element={
                        <ProtectedRoute adminOnly={true}>
                           <AdminDashboard />
                        </ProtectedRoute>
                     } />
                     <Route path="/profile" element={
                        <ProtectedRoute>
                           <UserDetails />
                        </ProtectedRoute>
                     } />
                  </Routes>
               </main>
               <Footer />
            </div>
         </Router>
      </UserProvider>
   )
}

export default App;