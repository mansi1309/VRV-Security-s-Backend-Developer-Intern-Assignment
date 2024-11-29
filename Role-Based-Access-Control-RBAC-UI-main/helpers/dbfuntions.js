require("dotenv").config();
const db= require('../config/connection')
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

// exporting database functions as object of functions
module.exports={
doSignup(name,email,password,role){
   return new Promise(async(resolve,reject)=>{
     await bcrypt.hash(password,parseInt(process.env.SALT_ROUND),(err,hash)=>{
        password=hash;
        db.get().collection(process.env.USER_COLLECTION).insertOne({name,email,password,role}).then((result)=>{
            resolve(result)
        })
    })
   }) 
},
doLogin(email,password){
     return new Promise(async (resolve, reject) => {
       let user = await db.get().collection(process.env.USER_COLLECTION).findOne({ email:email });
       if (user) {
         await bcrypt.compare(password,user.password,function (err, result) {
             if (result) {
               resolve(user);
             } else {
               reject({ status: "Enter Valid Password" });
             }
           }
         );
       } else {
         reject({ status: "Enter Valid Email" });
       }
     });

},
doAdminLogin(email,password){
   return new Promise(async (resolve, reject) => {
     let admin = await db
       .get()
       .collection(process.env.ADMIN_COLLECTION)
       .findOne({ email: email });
     if (admin) {
       await bcrypt.compare(password, admin.password, function (err, result) {
         if (result) {
           resolve(admin);
         } else {
           reject({ status: "Enter Valid Password" });
         }
       });
     } else {
       reject({ status: "Enter Valid Email" });
     }
   });
},getUsers(){
      return new Promise(async (resolve, reject) => {
        let users = await db
          .get()
          .collection(process.env.USER_COLLECTION)
          .find()
          .toArray();
          if(users){
            resolve(users);
          }else{
            reject({message:"No user Found"})
          }
        
      });
},updateRole(userId,role){
return new Promise(async(resolve,reject)=>{
await db.get().collection(process.env.USER_COLLECTION).updateOne({ _id:new ObjectId(userId) }, { $set: { role } } );
resolve(true)
})
},isRoleChanged(email){
  return new Promise(async(resolve,reject)=>{
 let user = await db.get().collection(process.env.USER_COLLECTION).findOne({ email:email });
 resolve(user)

  })
 
}
}