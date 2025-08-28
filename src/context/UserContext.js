import React, { useState, useEffect } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
   const [user, setUser] = useState({
      id: null,
      isAdmin: null,
      token: null
   });
   const [isLoading, setIsLoading] = useState(true);

   const unsetUser = () => {
      localStorage.removeItem('token');
      setUser({
         id: null,
         isAdmin: null,
         token: null
      });
   };

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: { Authorization: `Bearer ${token}` }
         })
         .then(res => res.json())
         .then(data => {
            if (data.user) {
               setUser({ id: data.user._id, isAdmin: data.user.isAdmin, token: token });
            } else {
               unsetUser();
            }
         })
         .catch(() => {
            unsetUser();
         })
         .finally(() => {
            setIsLoading(false);
         });
      } else {
         setIsLoading(false);
      }
   }, []);

   const contextValue = {
      user,
      setUser,
      unsetUser,
      isLoading
   };

   return (
      <UserContext.Provider value={contextValue}>
         {children}
      </UserContext.Provider>
   );
};

export default UserContext;
