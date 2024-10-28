import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import Products from './Products.js';
import Form from './Form.js';
import Papa from 'papaparse';

const { width } = Dimensions.get('window');

const Home = () => {
  const [products, setProducts] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [productId, setProductId] = useState('');
  const [buyProduct, setBuyProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableProducts, setShowAvailableProducts] = useState(false);

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

  const mergedProducts = !showAvailableProducts 
    ? products.map((product) => {
        const stockInfo = stockData.find((stock) => stock['Product ID'] === product['Product ID']);
        return {
          ...product,
          stockAvailable: stockInfo && stockInfo['Stock Available'] === 'True',
        };
      })
    : products
        .map((product) => {
          const stockInfo = stockData.find((stock) => stock['Product ID'] === product['Product ID']);
          return {
            ...product,
            stockAvailable: stockInfo && stockInfo['Stock Available'] === 'True',
          };
        })
        .filter((product) => product.stockAvailable);

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
        <TouchableOpacity 
          onPress={() => setShowAvailableProducts(!showAvailableProducts)} 
          style={[styles.navButton, styles.showAvailableButton]}>
          <Text style={styles.navButtonText}>{showAvailableProducts ? 'Show All' : 'Show Available'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            setBuyProduct(false);
            setShowAvailableProducts(false);
          }} 
          style={[styles.navButton, styles.productListButton]}>
          <Text style={styles.navButtonText}>Product List</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setBuyProduct(true)} 
          style={[styles.navButton, styles.buyProductButton]}>
          <Text style={styles.navButtonText}>Buy Product</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {buyProduct ? (
        <View style={styles.formContainer}>
          <Form stockData={stockData} pincodes={pincodes} productId={productId} setProductId={setProductId} setBuyProduct={setBuyProduct} />
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
    flexWrap: width < 500 ? 'wrap' : 'nowrap', // Wrap for smaller screens
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchBar: {
    flex: width < 500 ? 1 : 1.5, // Adjust width for smaller screens
    marginHorizontal: 8,
    paddingVertical: width < 500 ? 6 : 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderColor: '#ced4da',
    borderWidth: 1,
    fontSize: 14,
    minWidth: width < 500 ? '100%' : 'auto', // Full width on small screens
  },
  navButton: {
    paddingVertical: width < 500 ? 4 : 6, // Compact padding for smaller screens
    paddingHorizontal: width < 500 ? 8 : 10,
    borderRadius: 4,
    backgroundColor: '#17a2b8',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    minWidth: width < 500 ? '100%' : 'auto', // Full width on small screens
    marginTop: width < 500 ? 4 : 0, // Add margin-top for wrapped items
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: width < 500 ? 13 : 14, // Adjust font size for smaller screens
    textAlign: 'center',
  },
  showAvailableButton: {
    backgroundColor: '#28a745',
  },
  productListButton: {
    backgroundColor: '#17a2b8',
  },
  buyProductButton: {
    backgroundColor: '#ffc107',
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
