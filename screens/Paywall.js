
import React from "react";
import { View } from "react-native";
import { Text, Button, Card, Title, Paragraph } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const PaywallScreen = ({ onUpgrade }) => {
  const navigation = useNavigation();

  const handlePurchase = async () => {
    await onUpgrade();
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Card>
        <Card.Content>
          <Title>Go Pro</Title>
          <Paragraph>
            Unlock premium features:
            {"\n"}✔ Price Alerts
            {"\n"}✔ Unlimited Trade History
            {"\n"}✔ Advanced Charts
          </Paragraph>
          <Button mode="contained" onPress={handlePurchase} style={{ marginTop: 20 }}>
            Upgrade to Pro – $9.99
          </Button>
          <Button onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
            Not now
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default PaywallScreen;
