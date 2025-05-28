useEffect(()=>{
    const checkPriceAndNotify = async ()=>{
const result = await
fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs-currencies=aud");
const price = (await result.json()).bitcoin.aud;
if (price>75000){
    await Notifications.scheduleNotificationAsync({
        content:{
        title:"Bitcoin Alert",
        body:`Bitcoin is now at $${price}!`

        },
        trigger:null // fires response immediately
    });
}
    };
    const interval = setInterval(checkPriceAndNotify, 60000*10);
    return ()=> clearInterval(interval);
},[]
);