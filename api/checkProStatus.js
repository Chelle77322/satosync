// api/checkProStatus.js
import { getAuth } from "firebase/auth";

export const checkProStatus = async () => {
  const user = getAuth().currentUser;
  const token = await user.getIdToken();

  const res = await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/check-pro", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data.isPro;
};
