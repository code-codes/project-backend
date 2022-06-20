const exp = require('express')
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//to extract body of request
userApp.use(exp.json())


userApp.get('/getusers', expressAsyncHandler( async(request, response) => {
    let userCollectionObj = request.app.get("userCollectionObj");

    let userDetails = await userCollectionObj.find().toArray();

    response.send({message: "User details", payload: userDetails})

}));

userApp.post('/login', expressAsyncHandler(async(request, response) => {
    let userCollectionObj = request.app.get("userCollectionObj");
    let userCredObj = request.body;
    //search for username
    let userOfDB = await userCollectionObj.findOne({username: userCredObj.username})
    if(userOfDB == null) {
        response.send({message: "Invalid User"})
    } 
    else {
        let status = await bcryptjs.compare(userCredObj.password, userOfDB.password);
        
        if(status == false) {
            response.send({message: "Invalid password"})
        }
        else {
            let token = jwt.sign({username: userOfDB.username}, 'abcdef', {expiresIn:60})
            response.send({message: "login success", payload: token, userObj:userOfDB})
        }
    }
}));

userApp.post('/create-user', expressAsyncHandler( async(request, response) => {
    //get userCollection object
    let userCollectionObj = request.app.get("userCollectionObj");
    //get user object from client
    let newUserObj = request.body;
    //check if there is a existing user on the name
    let userOfDB = await userCollectionObj.findOne({username: newUserObj.username})
    if(userOfDB != null) {
        response.send({message: "Username has already taken. Please choose anathor"})
    }
    else {
        //hash password
        let hashedPassword = await bcryptjs.hash(newUserObj.password, 6);
        //replace plain text password with hashed password
        newUserObj.password = hashedPassword
        //insert new user to db
        await userCollectionObj.insertOne(newUserObj)

        response.send({message: "user inserted successfully"})
    }

}))


module.exports = userApp;