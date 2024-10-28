import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import Products from './Products.js';
import Form from './Form.js';
import Papa from 'papaparse';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [productId, setProductId] = useState('');
  const [buyProduct, setBuyProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCSV = async (filePath, setData) => {
      try {
        const response = await fetch(filePath);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvData = decoder.decode(result.value);

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => setData(result.data),
          error: (error) => console.error('Error parsing CSV:', error),
        });
      } catch (error) {
        console.error('Error fetching CSV file:', error);
      }
    };

    fetchCSV('../../assets/Products.csv', setProducts);
    fetchCSV('../../assets/Stock.csv', setStockData);
    fetchCSV('../../assets/Pincodes.csv', setPincodes);
  }, []);

  const mergedProducts = products.map((product) => {
    const stockInfo = stockData.find((stock) => stock['Product ID'] === product['Product ID']);
    return {
      ...product,
      stockAvailable: stockInfo && stockInfo['Stock Available'] === 'True',
    };
  });

  // Filter products based on the search query
  const filteredProducts = mergedProducts.filter(product =>
    product['Product Name'].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setBuyProduct(false)} style={styles.navButton}>
          <Text style={styles.navButtonText}>Product List</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setBuyProduct(true)} style={styles.navButton}>
          <Text style={styles.navButtonText}>Buy Product</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {buyProduct ? (
        <View style={styles.formContainer}>
          <Form stockData={stockData} pincodes={pincodes} productId={productId} setProductId={setProductId} />
        </View>
      ) : (
        <View style={styles.productsContainer}>
          <Products mergedProducts={filteredProducts} setProductId={setProductId} setBuyProduct={setBuyProduct} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e8ecef',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 8,
    padding: 10,
    backgroundColor: '#ffffff', // Set background color to white
    borderRadius: 6,
    borderColor: '#ced4da', // You can change this to a different color if needed
    borderWidth: 1,
  },
  navButton: {
    padding: 12,
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  productsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
});

export default Home;
