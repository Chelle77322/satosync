import authenticate from "../middleware/authMiddleware";
app.post("/trades", authenticate, (request, result)=>{
//Now request.user contains Firebase user information

});