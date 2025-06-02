import { getAuth } from "firebase/auth";

export const fetchTrades = async () => {
  const user = getAuth().currentUser;
  const token = await user.getIdToken();

  const result = await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades", {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!result.ok) throw new Error("Failed to fetch trades");
  return await result.json();
};
