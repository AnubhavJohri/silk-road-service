const express = require('express');
const routing = express.Router();
const db = require('../model/UserDbSetup');
const UserService = require('../service/user');
const UserData = require('../model/UserData');
const PostData = require('../model/PostData');

//1.)
//Used to Setup Dummy data for testing
routing.get('/setupdb' , (req ,res ,next) => {
    db.setupDb().then( result => {
        res.json({"message" : result});
    })
})


//2.)
//DUMMY FUNCTIONALITY 
//to test whether functionality is active
routing.get('/' , (req,res,next) => {
    res.json("User module of the Service is up and running @port 1111 , just fine sir!");
})


//3.)
//Handles login functionality
//1.)Returns User data if entered credentials are correct
//2.)Returns msgs for password incorrect and Account not existing
routing.post('/login' , (req,res,next) => {
    const uname = req.body.uname;
    const upass = req.body.upass;
    UserService.login( uname , upass )
    .then( data => {
        //console.log("sending response = " , data);
        res.json(data);
    })
    .catch( err => {
        //console.log("error message=",err.message);
        next(err);
    });
});


//4.)
//REGISTER FUNCTIONALITY
//Used to handle SignUp functionality
//Recieves User Information Object from front end and creates account for that particular user
routing.post('/register' , (req,res,next) => {
    const userOb = new UserData(req.body);
    //console.log(userOb);
    UserService.register(userOb)
    .then( result => {
        res.json({"message" : "You have been successfully registered! with User-Id "+result});
    })
    .catch( err =>{
        next(err);
    })
    //res.json("COMING SOON!!");
})



//5.)
//DELETE USER ACCOUNT FUNCTIONALITY
//Takes userId that needs to be deleted
routing.delete('/deleteUser/:userId' , (req,res,next) => {
    const userId = req.params.userId;
    UserService.deleteUser(userId)
    .then(userId=>{
        res.json({"message":"Your account with UserId "+userId+" has been deleted!"});
    })
    .catch(err=>{
        next(err);
    })
})





//const dbModule = require('../model/data');
//routing for Login Validation - EXPECTS NAME AND PASSWORD!!
// try URL - http://localhost:3000/login and http://localhost:3000/myTransactions/:alex@gmail.com
// routing.post('/login',  (req, res, next) => {
//     let username = req.body.username;
//     let password = req.body.password;
//     console.log(req.body);
//     console.log("request for log in received!!")
//     let result = dbModule.LoginUser(username, password)
//     if (result)
//         res.json({ "message": "User successfully Logged in with user name: " + result });
//     else {
//         let err = new Error();
//         err.status = 401;
//         err.message = "Unauthorized access!!"
//         next(err);
//     }
// })
// //Routing for Transactions Details
// routing.get('/myTransactions/:username',(req, res, next) => {
//     let username = req.params.username;
//     console.log(username)
//     let tlist = dbModule.retrieveUsersTransactions(username)
//     if (tlist && tlist.length>0)
//         res.json(tlist);
//     else {
//         let err = new Error();
//         err.status = 404;
//         err.message = "No transaction details found!!"
//         next(err);
//     }
// })
module.exports = routing;
