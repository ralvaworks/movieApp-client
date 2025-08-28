const jwt = require('jsonwebtoken');

require("dotenv").config();


module.exports.createAccessToken = (user) => {
   const data = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
   }
   return jwt.sign(data, process.env.JWT_SECRET_KEY, {})
}


// to verify the token if it is a valid token for our application
module.exports.verify = (req, res, next) => {
   let token = req.headers.authorization;

   // console.log(req.headers.authorization);  // to check access token

   if (typeof token === 'undefined') {
      return res.status(401).send({ message: "Authentication failed. No token provided." });
   } else {
      token = token.slice(7, token.length); // Remove "Bearer " from the token string
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
         if (err) {
            return res.status(401).send({ auth: "Failed", message: err.message });
         } else {
            req.user = decodedToken;
            next();
         }
      });
   }
}


module.exports.verifyAdmin = (req, res, next) => {
   if (req.user.isAdmin) next();
   else return res.status(403).json({ auth: "Failed", message: "Action Forbidden" });
}


module.exports.errorHandler = (err, req, res, next) => {
   const errorMessage = err.message;
   const statusCode = err.status || 500;

   res.status(statusCode).json({
      error: {
         message: errorMessage,
         errorCode: err.code || "SERVER ERROR",
         details: err.details || null
      }
   })
}


module.exports.isLoggedIn = (req, res, next) => {
   if (req.user) next();
   else res.status(401).send("Unauthorized");  // missing creds, redirect to login page
}