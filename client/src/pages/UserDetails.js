import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const API_URL = process.env.REACT_APP_API_BASE_URL;
const notyf = new Notyf();

const UserDetails = () => {
   const { user, unsetUser } = useContext(UserContext);
   const [userDetails, setUserDetails] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [showPasswordModal, setShowPasswordModal] = useState(false);
   const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
   });
   const [isChangingPassword, setIsChangingPassword] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      if (!user.id) {
         navigate('/login');
         return;
      }
      
      const fetchUserDetails = async () => {
         try {
            const response = await fetch(`${API_URL}/users/details`, {
               headers: {
                  'Authorization': `Bearer ${user.token}`
               }
            });

            const data = await response.json();

            if (response.ok) {
               setUserDetails(data.user);
            } else {
               notyf.error('Failed to fetch user details');
               if (response.status === 401) {
                  unsetUser();
                  navigate('/login');
               }
            }
         } catch (error) {
            console.error('Error fetching user details:', error);
            notyf.error('Network error. Please try again.');
         } finally {
            setIsLoading(false);
         }
      };

      fetchUserDetails();
   }, [user.id, user.token, navigate, unsetUser]);

   const handlePasswordChange = (e) => {
      const { name, value } = e.target;
      setPasswordData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handlePasswordSubmit = async (e) => {
      e.preventDefault();

      if (passwordData.newPassword !== passwordData.confirmPassword) {
         notyf.error('New passwords do not match');
         return;
      }

      if (passwordData.newPassword.length < 8) {
         notyf.error('New password must be at least 8 characters');
         return;
      }

      setIsChangingPassword(true);

      try {
         const response = await fetch(`${API_URL}/users/update-password`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
               currentPassword: passwordData.currentPassword,
               newPassword: passwordData.newPassword
            })
         });

         const data = await response.json();

         if (response.ok) {
            notyf.success('Password updated successfully');
            setShowPasswordModal(false);
            setPasswordData({
               currentPassword: '',
               newPassword: '',
               confirmPassword: ''
            });
         } else {
            notyf.error(data.message || 'Failed to update password');
         }
      } catch (error) {
         console.error('Error updating password:', error);
         notyf.error('Network error. Please try again.');
      } finally {
         setIsChangingPassword(false);
      }
   };

   if (isLoading) {
      return (
         <></>
      );
   }

   if (!userDetails) {
      return (
         <></>
      );
   }

   return (
      <></>
   );
};

export default UserDetails;
