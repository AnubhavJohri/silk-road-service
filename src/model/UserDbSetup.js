const collection = require('../utilities/connection');

const userDb = [
    {
        "userId" : "U1001",
        "userFirstName" : "Anubhav" ,  
        "userSecondName" : "Johri" , 
        "userMobileNo" : "9958056076" ,
        "userEmailId" : "anubhavj22" ,
        "userPassword" : "123456789" ,
        "userPosts" : [],
    },
    {
        "userId" : "U1002",
        "userFirstName" : "Anand" , 
        "userSecondName" : "Singh" ,
        "userMobileNo" : "9999999999" ,
        "userEmailId" : "ezzyboi22" ,
        "userPassword" : "123456789" ,
        "userPosts" : [],
    },
];

let db = {};

db.setupDb = () =>{
    return collection.getUserCollection().then((user) => {
        return user.deleteMany().then(() => {
            return user.insertMany(userDb).then((data) => {
                
                if( data )
                {   
                    return "User Data Inserted Successfully!";}
                else{
                    let e = new Error();
                    e.message = "Insertion Failed";
                    e.status = 500;
                    throw e;
                }
            })

        })
    })
}

module.exports = db;