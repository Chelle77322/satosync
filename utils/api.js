export const getBTCPrice = async()=>{
    try{
        const res = await
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud");
        const data = await res.json();
        return data.bitcoin.aud;
    } catch (error){
        console.error(error);
        return null;
    }
}