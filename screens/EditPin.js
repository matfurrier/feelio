import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DialPad from "../components/DialPad";
import SecureStoreModel from "../constants/SecureStoreModel";
import { DContexts } from "../contexts/DContexts";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useStyles from "../constants/styles";

const EditPin = () => {
  const [pin, setPin] = useState("");
  const { primarycolor } = useContext(DContexts);
  const css = useStyles();
  const { bgcolor } = useContext(DContexts);
  const navigation = useNavigation();

  const handlePress = (value) => {
    if (value === "backspace") {
      setPin((prevPin) => prevPin.slice(0, -1));
    } else {
      if (pin.length < 4) {
        const newPin = pin + value.toString();
        setPin(newPin);

        if (newPin.length === 4) {
          authenticatePin(newPin);
        }
      }
    }
  };

  const authenticatePin = (pin) => {
    setPin("");
    SecureStoreModel.updateItem("pin", pin);
    navigation.navigate("Home");
    alert("You have changed your pin successfully!");
  };

  return (
    <View style={{ backgroundColor: bgcolor, ...styles.container }}>
      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="chevron-back-circle" color={primarycolor} size={50} />
      </TouchableOpacity>

      <Text style={{ ...css.txt, ...styles.inputText }}>
        Update your feelio pin:
      </Text>
      <Text style={{ ...styles.pin, ...css.txt }}>
        {"*".repeat(pin.length)}
      </Text>
      <DialPad onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    fontSize: 20,
    marginBottom: 20,
  },
  pin: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default EditPin;
