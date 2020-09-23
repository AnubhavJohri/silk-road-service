const UserModel = require('../model/user');

let UserService = {};

UserService.login = (uname , upass) =>{
    console.log(uname , upass , "in service.js");
   return UserModel.login( uname , upass )
    .then( data => {
        if(data == 1)
        {
            let e = new Error();
            e.message = "Entered Password is Wrong!";
            e.status = 406 ;
            throw e;
        }
        else if(data == 2)
        {
            let e = new Error();
            e.message = "Account with Entered EmailId/Mobile Number Doesn't exist!";
            e.status = 406 ;
            throw e;
        }
        else
        return data;
    } );
}

UserService.register = (userOb) =>{
    //console.log("User Object in service=",userOb);
    return UserModel.register(userOb).then(data => {
        if(data == 1){
            let e = new Error();
            e.message="Entered Email-Id/Mobile Number already exists!";
            e.status = 406;
            throw e;
        }else{
            return data;
        }
    })
}

UserService.deleteUser= (userId) => {
    return UserModel.deleteUser(userId).then( data =>{
        if(data)
        return data;
        else{
            let e = new Error();
            e.message = "Something went wrong , Account not deleted . Either UserId didn't exist or was of wrong format";
            e.status = 500;
            throw e;
        }
    })

}

module.exports = UserService;