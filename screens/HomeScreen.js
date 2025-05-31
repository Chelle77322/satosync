import React, { useEffect, useState } from "react";
import { TextVariant } from 'react-native-paper';
import { ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import {
  TextInput,
  Button,
  Card,
  TextVariant,
  Provider as PaperProvider
} from "react-native-paper";
import { usePro } from "../context/ProContext";
import { useNavigation } from "@react-navigation/native";
const HomeScreen = () => {
  const { isProUser } = usePro();
  const navigation = useNavigation();

  const [priceAlertEnabled, setPriceAlertEnabled] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    const sampleTrades = [
      { id: 1, price: 68000, quantity: 0.005 },
      { id: 2, price: 66500, quantity: 0.007 },
      { id: 3, price: 69000, quantity: 0.003 },
    ];
    setTradeHistory(isProUser ? sampleTrades : sampleTrades.slice(0, 1));
  }, [isProUser]);

  const handleToggleAlert = () => {
    if (!isProUser) {
      navigation.navigate("Paywall");
    } else {
      setPriceAlertEnabled(!priceAlertEnabled);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Card style={{ marginBottom: 20 }}>
        <Card.Title title="Price Alerts" />
        <Card.Content>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>Enable BTC Price Alerts</Text>
            <Switch value={priceAlertEnabled} onValueChange={handleToggleAlert} />
          </View>
        </Card.Content>
      </Card>

      <Card>
        <Card.Title title="Recent Trades" />
        <Card.Content>
          {tradeHistory.map((trade) => (
            <Text key={trade.id}>
              {trade.quantity} BTC @ ${trade.price}
            </Text>
          ))}
          {!isProUser && (
            <Button onPress={() => navigation.navigate("Paywall")} style={{ marginTop: 10 }}>
              Upgrade to unlock full history
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;
