import { getAuth } from "firebase/auth";
export const submitTrade = async (trade) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();

  const result = await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(trade),
  });

  if (!result.ok) throw new Error("Failed to submit trade");
  return await result.json();
};
