class userData {
    constructor(user) {
        this.userId = "",
        this.userFirstName = user.firstName.trim(),
        this.userSecondName = user.secondName.trim(),
        this.userMobileNo = user.mobileNo.trim(),
        this.userEmailId = user.emailId.toLowerCase().trim(),
        this.userPassword = user.password.trim() ,
        this.userPosts = user.posts //NEW FIELD : type array
    }
}
module.exports = userData