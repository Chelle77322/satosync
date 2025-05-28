import React, {useEffect, useState} from "react";
import {View, Dimensions, Text} from "react-native";
import {LineChart} from "react-native-chart-kit";
import {getAuth} from "../firebaseAuth";

const ChartScreen =()=>{
    const [labels, setLabels] = useState([]);
    const[btcData, setBtcData]=useState([]);

    useEffect(()=>{
        const fetchData = async()=>{
            const user = getAuth().currentUser;
            const token = await user.getIdToken();
            const result = await
            fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades", {
                headers:{Authorization:`Bearer${token}`}
            });
            const trades = await result.json();
            const sorted = trades.sort((a, b)=>new Date(a.timestamp)- new Date(b.timestamp));
            const labels = sorted.map(t=> new Date(t.timestamp).toLocaleDateString());
            const values = sorted.map(t=>parseFloat(t.price));
            setLabels(labels);
            setBtcData(values)
        };
        fetchData();
    }, []);
    return(
        <View>
            <Text style = {{fontSize:18, marginLeft:20, marginTop:20}}>BTC Buy Price Over Time</Text>
            <LineChart
            data=
            {{
                labels:labels.slice(-5), //Limits it to recent 5
                datasets:[{data: btcData.slice(-5)}]
            }}
            width={Dimensions.get("window").width-20}
            height={220}
            yAxisLabel="$"
            chartConfig={{
                backgroundColor:"#ffee77",
                backgroundGradientFrom:"#1e1e1e",
                backgroundGradientTo:"#3e3e3e",
                decimalPlaces:2,
                color:(opacity = 1)=> `rgba(0,255, 132${opacity})`,
                labelColor:() =>"#ccc000"}}
                style={{marginVertical:20, borderRadius:16}}
                />
                </View>

        

    );
};
export default ChartScreen