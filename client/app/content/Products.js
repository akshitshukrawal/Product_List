import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Products = ({ mergedProducts, setProductId, setBuyProduct }) => {
  
  return (
    <View style={styles.container}>
      {console.log(mergedProducts)}
      <Text style={styles.title}>Products List</Text>
      <FlatList
        data={mergedProducts && mergedProducts}
        keyExtractor={(item) => item['Product ID']}
        numColumns={4}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={[styles.productCard, item.stockAvailable ? styles.inStock : styles.outOfStock]}>
            <Text style={styles.text}>Product ID: {item['Product ID']}</Text>
            <Text style={styles.text}>Product Name: {item['Product Name']}</Text>
            <Text style={styles.text}>Price: {item['Price']}</Text>
            <Text style={styles.text}>Available: {item.stockAvailable ? 'Yes' : 'No'}</Text>
            <TouchableOpacity
              onPress={() => {
                if (item.stockAvailable) {
                  setProductId(item['Product ID']);
                  setBuyProduct(true); 
                }
              }}
              style={[styles.button, !item.stockAvailable && styles.disabledButton]}
              disabled={!item.stockAvailable}
            >
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e8ecef',
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '23%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10,
  },
  inStock: {
    backgroundColor: '#28a745',
  },
  outOfStock: {
    backgroundColor: '#dc3545',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  button: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Products;
