var express = require('express');
const dbFunctions = require("../helpers/dbfuntions");
const jwt = require("jsonwebtoken");
const middleware = require("../helpers/custommiddlewares");
var router = express.Router();


//jwt token verify middleware
function verifyLogin(req, res, next) {
  const cookie = req.cookies.jwtAdmin;
  middleware
    .verifyJwtToken(cookie)
    .then((token) => {
      if (token) {
        next();
      }
    })
    .catch((err) => {
      res.send(err);
    });
}

/* GET admin login page. */
router.get('/', function(req, res, next) {
  req.cookies.jwtAdmin? res.redirect("/admin/dashboard") : res.render("login-admin");
});

//post method  admin login
router.post('/',(req,res)=>{
  const { email, password } = req.body;
  if (!email || !password) {
    res.send("All filed Are mandatory");
  } else {
    dbFunctions
      .doAdminLogin(email, password)
      .then((result) => {
        if (result) {
          const token = jwt.sign(
            { user: email, role: result.role },
            process.env.JWT_SECRET.toString(),
            { expiresIn: "1h" }
          );
          res.cookie("jwtAdmin", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
          });
          res.send({
            message:
              "login success Now You can go dashboard by get method /dashboard ",
            info: "this tab not redirect to /dashboard because res.send this message and server closed response (iam done  this assessment for backend developer intern so pop up designs not developed for show user authentication success  ). next time by calling [/] by get if you are authenticated automatically redirect to /dashboard",
          });
        }
      })
      .catch((err) => {
        if (err) {
          res.send(err);
        }
      });
  }
})

//get user route 
router.get("/dashboard",verifyLogin,(req,res)=>{
  dbFunctions.getUsers().then((users)=>{
  res.render("admin-dashboard",{users});
  })

});


//update user role by put method not possible in browser call
//in addition we can write put and do operation by calling put method on postman  and pass jwtAdminToken as Bearer Token  we can perform user role update  by api call
//in given assignment RBAC UI develop so browser doest call put method 
//so i am calling get method for UI 
router.get("/updateUser/",verifyLogin,(req,res)=>{
const {userId,userrole} = req.query;
dbFunctions.updateRole(userId,userrole).then((result)=>{
  res.redirect("/admin/dashboard");
})

});
module.exports = router;
