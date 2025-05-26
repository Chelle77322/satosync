import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { getBTCPrice } from "../utils/api";

const HomeScreen = ({ navigation }) => {
  const [btcPrice, setBtcPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getBTCPrice();
      setBtcPrice(price);
    };
    fetchPrice();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>BTC Price: ${btcPrice}</Text>
      <Button title="Add Trade" onPress={() => navigation.navigate("AddTrade")} />
    </View>
  );
};

export default HomeScreen;
