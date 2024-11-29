require("dotenv").config();
// middleware Helper For JWT Token verify
const jwt = require("jsonwebtoken");
module.exports = {
  verifyJwtToken(token) {
    return new Promise(async(resolve, reject) => {
       await jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
          if(decoded){
            resolve(decoded)
          }else if(err){
            reject({message:"invalid Token User not authenticated"})
          }
        });
    });
  },
};
