
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as RNIap from 'react-native-iap';
import { usePro } from "../context/ProContext";

const productIds = ['pro_version'];

const InAppPurchaseScreen = () => {
  const [products, setProducts] = useState([]);
  const [purchased, setPurchased] = useState(false);
  const { markAsPro } = usePro();

  useEffect(() => {
    RNIap.initConnection().then(async () => {
      const availableProducts = await RNIap.getProducts(productIds);
      setProducts(availableProducts);
    }).catch(console.warn);

    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(purchase => {
      if (purchase.productId === 'pro_version') {
        markAsPro();
        setPurchased(true);
      }
    });

    return () => {
      RNIap.endConnection();
      purchaseUpdateSubscription.remove();
    };
  }, []);

  const buyPro = async () => {
    try {
      await RNIap.requestPurchase('pro_version');
    } catch (err) {
      console.warn(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        {purchased ? 'Thank you for upgrading!' : 'Upgrade to Pro to unlock alerts and unlimited history'}
      </Text>
      {!purchased && products.length > 0 && (
        <Button mode="contained" onPress={buyPro}>
          Buy Pro (${products[0].localizedPrice})
        </Button>
      )}
    </View>
  );
};

export default InAppPurchaseScreen;
