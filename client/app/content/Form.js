import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Form = ({ stockData, pincodes, productId, setProductId, setBuyProduct }) => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkAvailability = (e) => {
    const stock = stockData.find((product) => product['Product ID'] === productId);
    if (!stock || stock['Stock Available'] === 'False') {
      setError('Product not available');
      setResult(null);
      return;
    }

    const pincodeData = pincodes.find((item) => item.Pincode === pincode);
    if (pincodeData) {
      const currentDateTime = new Date();
      const currentTime = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
      let deliveryTime = '';

      const providerATime = 17 * 60;
      const providerBTime = 9 * 60;

      if (pincodeData["Logistics Provider"] === 'Provider A') {
        deliveryTime = currentTime < providerATime
          ? `Same day delivery available for ${Math.floor((providerATime - currentTime) / 60)} hour(s) and ${((providerATime - currentTime) % 60)} minute(s), else take ${pincodeData.TAT} days.`
          : `Delivery will take ${pincodeData.TAT} days.`;
      } else if (pincodeData["Logistics Provider"] === 'Provider B') {
        deliveryTime = currentTime < providerBTime
          ? `Same day delivery available for ${Math.floor((providerBTime - currentTime) / 60)} hour(s) and ${((providerBTime - currentTime) % 60)} minute(s), else take ${pincodeData.TAT} days.`
          : `Delivery will take ${pincodeData.TAT} days.`;
      } else {
        deliveryTime = `Delivery will take ${pincodeData.TAT} days.`;
      }

      setResult({ productId, logisticsProvider: pincodeData["Logistics Provider"], tat: pincodeData.TAT, time: currentDateTime.toLocaleString(), deliveryTime });
      setError('');
    } else {
      setError('Pincode not available for this product.');
      setResult(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Product</Text>
      {result ? (
        <View style={styles.card}>
          <Text style={styles.text}>Order Confirmed</Text>
          <Text style={styles.text}>Product ID: {result.productId}</Text>
          <Text style={styles.text}>Logistics Provider: {result.logisticsProvider}</Text>
          <Text style={styles.text}>Time of Order: {result.time}</Text>
          <Text style={styles.text}>Delivery Time: {result.deliveryTime}</Text>
          <Button title="Continue Buying" onPress={() => setBuyProduct(false)} />
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter Product ID"
            value={productId}
            onChangeText={setProductId}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Pincode"
            value={pincode}
            onChangeText={setPincode}
          />
          <Button title="Check Availability" onPress={checkAvailability} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    width: '100%',
    borderRadius: 5,
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#28a745',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});

export default Form;
