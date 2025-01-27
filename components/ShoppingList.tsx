import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface ShoppingListProps {
  items: { _id: string; itemName: string; qty: number; days: number }[];
  onAddItem: () => void;
  onRemoveAll: () => void;
  onRemoveItem: (id: string) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  onAddItem,
  onRemoveAll,
  onRemoveItem,
}) => {
  // בדיקת תפוגת פריטים
  const checkExpiryDates = () => {
    items.forEach((item) => {
      if (item.days <= 0) {
        Alert.alert('Reminder', `${item.itemName} is running out!`);
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(checkExpiryDates, 24 * 60 * 60 * 1000); // בדיקה כל יום
    return () => clearInterval(interval);
  }, [items]);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {item.itemName} - Quantity: {item.qty}, Days: {item.days}
            </Text>
            <TouchableOpacity onPress={() => onRemoveItem(item._id)}>
              <Entypo name="trash" size={20} color="#DF6316" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No items in the shopping list</Text>}
      />
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert('Delete All Items', 'Are you sure you want to clear the shopping list?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Yes', onPress: onRemoveAll },
            ])
          }
        >
          <Text style={styles.deleteButtonText}>Clear List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemText: { fontSize: 18 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#888' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 ,
    bottom: 100
  },
  addButton: { backgroundColor: '#DF6316', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 5 },
  addButtonText: { color: '#fff', fontSize: 18 },
  deleteButton: { backgroundColor: '#FF4C4C', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 5 },
  deleteButtonText: { color: '#fff', fontSize: 18 },
});
