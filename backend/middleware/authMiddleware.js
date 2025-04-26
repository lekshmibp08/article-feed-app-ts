import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
    console.log("Entered");
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(token);
  
  if (!token) {
    console.log("no token");    
      return next({ message: "Access denied. Authentication token is missing.", statusCode: 401 });
  } 

  try {    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("User in Req", req.user);
    
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
