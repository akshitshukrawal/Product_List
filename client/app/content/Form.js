import React, { useState } from 'react';
import Papa from 'papaparse';

const Form = ({ stockData, pincodes, productId, setProductId }) => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkAvailability = (e) => {
    e.preventDefault();

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
      }else{
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
    <div style={styles.container}>
      {result ? (
        <div style={styles.card}>
          <h2>Order Confirm</h2>
          <p><strong>Product ID:</strong> {result.productId}</p>
          <p><strong>Logistics Provider:</strong> {result.logisticsProvider}</p>
          <p><strong>TAT:</strong> {result.tat} days</p>
          <p><strong>Checked at:</strong> {result.time}</p>
          <p><strong>{result.deliveryTime}</strong></p>
        </div>
      ) : (
        <form onSubmit={checkAvailability} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="productId" style={styles.label}>Product ID:</label>
            <input type="text" id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="pincode" style={styles.label}>Pincode:</label>
            <input type="text" id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>Confirm Order</button>
          {error && <div style={styles.error}>{error}</div>}
        </form>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '400px', margin: 'auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '8px', fontSize: '16px', fontWeight: '600' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' },
  button: { padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  card: { padding: '20px', borderRadius: '8px', backgroundColor: '#e2f0d9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' },
  error: { marginTop: '20px', color: 'red' },
};

export default Form;
