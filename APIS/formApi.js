const exp = require('express')
const formApp = exp.Router();
const expressAsyncHandler = require("express-async-handler")
formApp.use(exp.json())

formApp.get('/create-form', expressAsyncHandler(async (request, response) => {
    //get formCollection object
    let formCollectionObj = request.app.get("formCollectionObj");
    //get user object from client
    let newUserObj = request.body;
    if (newUserObj.education == "Engineering(BE, BTech, MCA)")
        newUserObj.education = "13";
    if (newUserObj.courseRelativity == "No")
        newUserObj.courseRelativity = 0;
    else
        newUserObj.courseRelativity = 1;


    await formCollectionObj.insertOne(newUserObj)
    response.send({ message: "form inserted successfully" })

}))


module.exports = formApp;
