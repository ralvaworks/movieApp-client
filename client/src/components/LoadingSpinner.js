import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
   const sizeMap = {
      sm: '1rem',
      md: '2rem',
      lg: '3rem'
   };

   return (
      <div className="text-center py-4">
         <Spinner 
            animation="border" 
            style={{ 
               width: sizeMap[size], 
               height: sizeMap[size],
               borderColor: '#667eea',
               borderRightColor: 'transparent'
            }}
         />
         {text && <div className="mt-2 text-muted">{text}</div>}
      </div>
   );
};

export default LoadingSpinner;
