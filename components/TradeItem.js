const fetchTrades = async () => {
  const user = getAuth().currentUser;
  const token = await user.getIdToken();

  const res = await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const trades = await res.json();
  setUserTrades(trades);
};
