import { getAuth } from "firebase/auth";

// trade = { price, quantity, timestamp } — from your form
const submitTrade = async (trade) => {
  try {
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not logged in");

    const token = await user.getIdToken();

    const response = await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(trade)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Trade submission error:", data);
      alert("Error submitting trade");
      return;
    }

    console.log("Trade saved:", data);
    alert("Trade submitted!");
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong.");
  }
};
