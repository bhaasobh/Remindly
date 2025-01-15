import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface ShoppingListProps {
  items: { name: string; quantity: number; averageDays: number; purchaseDate: Date }[];
  onAddItem: () => void;
  onRemoveAll: () => void;
  onRemoveItem: (index: number) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onAddItem, onRemoveAll, onRemoveItem }) => {
  // פונקציה שבודקת אם פריטים קרובים להיגמר
  const checkExpiryDates = () => {
    const currentDate = new Date();
    items.forEach((item) => {
      const timeElapsed = Math.floor(
        (currentDate.getTime() - new Date(item.purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (timeElapsed >= item.averageDays) {
        Alert.alert('Reminder', `${item.name} is running out based on your usage pattern.`);
      }
    });
  };

  // קריאה לפונקציה בכל פעם שהרשימה משתנה
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiryDates();
    }, 24 * 60 * 60 * 1000); // בדיקה כל יום
    return () => clearInterval(interval); // ניקוי ה-interval
  }, [items]);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {item.name} - Quantity: {item.quantity}
            </Text>
            <TouchableOpacity onPress={() => onRemoveItem(index)}>
              <Entypo name="trash" size={20} color="#DF6316" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No items in the shopping list</Text>}
      />

      {/* כפתורים */}
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
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingBottom: 100
  },
  addButton: {
    backgroundColor: '#DF6316',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
