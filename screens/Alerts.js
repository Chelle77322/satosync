import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { getAuth } from "firebase/auth";

const AlertSettings = () => {
  const [threshold, setThreshold] = useState("");

  const saveThreshold = async () => {
    const user = getAuth().currentUser;
    const token = await user.getIdToken();

    await fetch("https://satosync-4dc0a22a0b02.herokuapp.com/set-alert-threshold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ threshold })
    });

    alert("Alert threshold saved!");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Set BTC Alert Price ($)</Text>
      <TextInput
        placeholder="e.g. 75000"
        value={threshold}
        onChangeText={setThreshold}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />
      <Button title="Save Alert Threshold" onPress={saveThreshold} />
    </View>
  );
};

export default AlertSettings;
