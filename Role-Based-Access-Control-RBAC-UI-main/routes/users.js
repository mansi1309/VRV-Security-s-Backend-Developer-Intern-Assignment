require("dotenv").config();
var express = require("express");
const dbFunctions = require("../helpers/dbfuntions");
const jwt = require("jsonwebtoken");
const middleware=require('../helpers/custommiddlewares');
var router = express.Router();

//middleware for jwt tokenVerify
function verifyLogin(req,res,next){
    const cookie = req.cookies.jwt;
  middleware.verifyJwtToken(cookie).then((token)=>{
if(token){
  next()
}
}).catch((err)=>{
  res.send(err)
})
}

/* GET users listing. */
router.get("/", function (req, res, next) {
  req.cookies.jwt ? res.redirect('/dashboard') : res.render("login");
});

//user login post method
router.post("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send("All filed Are mandatory");
  } else {
    dbFunctions
      .doLogin(email, password)
      .then((result) => {
        if (result) {
       const token = jwt.sign({ user: email,role:result.role }, process.env.JWT_SECRET.toString(), { expiresIn: '1h',} );
          res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 3600000 });
          res.send({
            message:
              "login success Now You can go dashboard by get method /dashboard ",
            info: "this tab not redirect to /dashboard because res.send this message  and server closed response (iam done  this assessment for backend developer intern so pop up designs not developed for show user authentication success  ). next time by calling [/] by get if you are authenticated then automatically redirect to /dashboard",
          });
        }
      })
      .catch((err) => {
        if (err) {
          res.send(err);
        }
      });
  }
});


//user signup get method for render signup page
router.get("/signup", (req, res) => {
  req.cookies.jwt ? res.redirect("/dashboard") : res.render("signup");;
  
});

// post method for user signup 
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.send("All filed Are mandatory");
  } else {
    dbFunctions.doSignup(name, email, password,'user').then((result) => {
      res.send({ status: "true", message: "userCreated" });
    });
  }
});

// get method for dashboard
router.get('/dashboard',verifyLogin,(req,res)=>{
  const cookie = req.cookies.jwt;
  middleware.verifyJwtToken(cookie).then((token) => {
    dbFunctions.isRoleChanged(token.user).then((result) => {
      if (result.role == token.role) {
      res.send({ message: "this is dashboard",YourRoleIs:token.role,info:"we can do operations based on User Roles" });

      // DO OPERATIONS BASED ON USER ROLE

      }else{
        res.send({ message: "your permission revoked by admin please log in again by calling /logout" });
      }
    });
  });
})

//logout get method
router.get('/logout',(req,res)=>{
res.clearCookie("jwt");
res.send({message:"You are Logout sucssfully"})
})
module.exports = router;
