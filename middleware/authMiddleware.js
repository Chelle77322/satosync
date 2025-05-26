import admin from "../firebaseAdmin";
const authenticate = async (request,result, next)=>{
    const authHeader= request.headers.authorization;
    if (!authHeader ||!authHeader.startsWith("Bearer"))
    {
        return
        result.status(401).send("Unauthorized");
    }
    const idToken = authHeader.split("Bearer")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        request.user = decodedToken;
        next();
    }
    catch (error){
        result.status(401).send("invalid token");
    }
};
module.exports = authenticate