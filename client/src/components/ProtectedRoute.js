import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
   const { user, isLoading } = useContext(UserContext);

   // Show loading while checking authentication
   if (isLoading) {
      return (
         <div style={{ paddingTop: '100px', minHeight: '100vh' }} className="d-flex justify-content-center align-items-center">
            <LoadingSpinner text="Checking authentication..." />
         </div>
      );
   }

   // Redirect to login if not authenticated
   if (!user.id) {
      return <Navigate to="/login" replace />;
   }

   // Redirect to movies if admin route but user is not admin
   if (adminOnly && !user.isAdmin) {
      return <Navigate to="/movies" replace />;
   }

   // Render children if authenticated and authorized
   return children;
};

export default ProtectedRoute;
