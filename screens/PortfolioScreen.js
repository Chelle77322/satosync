import {getAuth} from "firebase/auth";
const user = getAuth().currentUser;
const token = await user.getIdToken();
const response = await
fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades",
{
    method:"POST",
    headers:{
        "Content-Type":"application/json", 
        "Authorization": `Bearer
        ${token}`},
        body: JSON.stringify(trade)
    }

);