const collection = require('../utilities/connection');
let UserModel = {};


UserModel.login = (uname , upass) => {
    console.log("in userModel 1");
    return collection.getUserCollection().then(user => {
        console.log("in userModel 2");
        return user.findOne({$and : [ { $or : [ { userEmailId : uname } , { userMobileNo : uname} ] } ] },{_id : 0}).then(result => {
            console.log("in userModel 3");
            if( result )
            {
                if(result.userPassword == upass)
                return result;
                else
                return 1;
            }
            else
            return 2;
        });
    })

}


//UNIQUE USER-ID GENERATE FUNCTIONALITY
//Generates new unique user-id for every new User
UserModel.generateUserId = () =>{
    return collection.getUserCollection().then(user => {
        return user.find({},{ userId:1 , _id:0 }).sort( { userId : -1} ).limit(1).then(userId => {
            //console.log("userId=" , userId[0]);
            let uid = "";
            uid = userId[0].userId;
            uid = parseInt(uid.substring(1));
            uid = uid+1;
            uid = "U"+uid;
            //console.log("new uid=",uid);    
            return uid;
        })
    })
}

UserModel.register = (userOb) =>{
    return UserModel.generateUserId().then(new_uid=>{
        userOb.userId = new_uid;
        //console.log("userObject inserting=", userOb);
        return collection.getUserCollection().then(user => {
            return user.findOne( { $or : [ { userEmailId : userOb.userEmailId } , { userMobileNo : userOb.userMobileNo } ]} , { _id : 0 }).then( result => {
                if(result)
                return 1;
                else{
                    return user.insertMany(userOb).then( data => {
                        //console.log("object after insertion=", data);
                        return userOb.userId;
                    })
                }
            })
        })
    });
}

UserModel.deleteUser = (userId) =>{
    return collection.getUserCollection().then( user => {
        return user.deleteOne({userId : userId}).then( data =>{
            console.log("userid deleted=" , data);
            if(data.deletedCount>0){
                return userId;
            }
            else{
                return null;
            }
        })
    })
}

module.exports = UserModel ; 
// db.User.find({$and : [ { $or : [ { userEmailId : "anubhavj22a" } , { userMobileNo : "9958056076"} ] } , { userPassword : "123456789" } ] },{_id : 0}).pretty();
// db.User.find({$and : [ { userEmailId : "anubhavj22" } , { userPassword : "123456789" } ] },{_id : 0}).pretty();
// db.User.find({$or : [ { userEmailId : "anubhavj22a" } , { userMobileNo : "9958056076"} ] } , { _id : 0}).pretty();
//db.User.find({$and : [ { $or : [ { userEmailId : "anubhavj22"} , { userMobileNo : "9958056076"} ] } , { userPassword : "123456789" } ] },{_id : 0})

//db.User.find({},{ userId:1 , _id:0 }).sort( { userId : -1} ).limit(1);

// {
//     "firstName" : "Anubhav",
//     "secondName" : "Johri" ,
//     "mobileNo" : "9958056076" ,
//     "emailId" : "anubhavj22" ,
//     "password" : "aaaaa"
// }

//db.User.find( { $or : [ { userEmailId : "anubhavj22a" } , { userMobileNo : "9958056076" } ]} , { _id : 0 }).pretty()