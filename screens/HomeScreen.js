import { useEffect, useState } from "react";
import * as React from 'react';
import { TextVariant } from 'react-native-paper';
import { ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import {
  Text,
  TextInput,
  Button,
  Card,
  TextVariant,
  Paragraph,
  Provider as PaperProvider
} from "react-native-paper";

const HomeScreen = () => {
  const [trades, setTrades] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTrades = async () => {
    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      const result = await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await result.json();
      setTrades(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const submitTrade = async () => {
    try {
      setLoading(true);
      const user = getAuth().currentUser;
      const token = await user.getIdToken();

      const trade = {
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        timestamp: new Date().toISOString()
      };

      const result = await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(trade)
      });

      if (result.ok) {
        setPrice("");
        setQuantity("");
        fetchTrades(); // refresh
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const portfolioValue = trades.reduce((sum, t) => sum + t.price * t.quantity, 0);

  return (
    <PaperProvider>
      <ScrollView style={{ padding: 20 }}>
        <Card style={{ marginBottom: 20 }}>
          <Card.Content>
            <TextVariant>Portfolio Value</TextVariant>
            <TextVariant bodyMedium= {{ fontSize: 28, fontWeight: "bold" }}>
              ${portfolioValue.toFixed(2)}
         </TextVariant>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Card.Content>
            <TextVariant>Log New Trade</TextVariant>

            <TextInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={{ marginTop: 10 }}
            />
            <TextInput
              label="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={{ marginTop: 10 }}
            />

            <Button
              mode="contained"
              onPress={submitTrade}
              loading={loading}
              disabled={loading}
              style={{ marginTop: 20 }}
            >
              Submit Trade
            </Button>
          </Card.Content>
        </Card>

        {trades.length > 0 && (
          <Card>
            <Card.Content>
              <TextVariant>Trade History</TextVariant>
              {trades.map((trade, index) => (
                <TextVariant key={index}>
                  {trade.quantity} BTC @ ${trade.price} on{" "}
                  {new Date(trade.timestamp).toLocaleString()}
                </TextVariant>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </PaperProvider>
  );
};

export default HomeScreen;
