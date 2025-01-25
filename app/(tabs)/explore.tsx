import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ShoppingList } from '@/components/ShoppingList';
import { PersonalList } from '@/components/PersonalList';
import { ItemInputModal } from '@/components/ItemInputModal';
import { useLogin } from '../auth/LoginContext';
import config from '../../config';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  averageDays: number;
  purchaseDate: Date;
}

interface PersonalItem {
  _id: string;
  itemName: string;
}

export default function TabTwoScreen() {
  const { userId } = useLogin();
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [personalList, setPersonalList] = useState<PersonalItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isShoppingList, setIsShoppingList] = useState(true);

  // Fetch shopping and personal lists
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const shoppingResponse = await fetch(
          `${config.SERVER_API}/shopping-list/alllist/${userId}`,
          { method: 'GET' }
        );
        const shoppingData = await shoppingResponse.json();
        if (shoppingResponse.ok) {
          setShoppingList(shoppingData.items || []);
        } else {
          console.error('Failed to fetch shopping list:', shoppingData.error);
        }
      } catch (error) {
        console.error('Error fetching shopping list:', error);
        Alert.alert('Error', 'Failed to load the shopping list.');
      }

      try {
        const personalResponse = await fetch(
          `${config.SERVER_API}/users/${userId}/personal-items`,
          { method: 'GET' }
        );
        const personalData = await personalResponse.json();
        if (personalResponse.ok) {
          setPersonalList(personalData.personalItems || []);
        } else {
          console.error('Failed to fetch personal list:', personalData.error);
        }
      } catch (error) {
        console.error('Error fetching personal list:', error);
        Alert.alert('Error', 'Failed to load the personal list.');
      }
    };

    fetchLists();
  }, [userId]);

  // Add item to personal list
  const handleAddPersonalItem = async (name: string) => {
    const newItem = { itemName: name };

    try {
      const response = await fetch(`${config.SERVER_API}/users/${userId}/personal-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();
      if (response.ok && data.item) {
        setPersonalList((prev) => [
          ...prev,
          { _id: data.item._id, itemName: data.item.itemName },
        ]);
      } else {
        console.error('Server Error:', data.error);
        Alert.alert('Error', 'Failed to save personal item.');
      }
    } catch (error) {
      console.error('Error adding personal item:', error);
      Alert.alert('Error', 'Failed to save the personal item.');
    }
  };

  // Add item to shopping list
  const handleAddShoppingItem = async (name: string, quantity: number, averageDays: number) => {
    try {
      const response = await fetch(`${config.SERVER_API}/shopping-list/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: name, qty: quantity, days: averageDays }),
      });
      const data = await response.json();
      if (response.ok && data.item) {
        setShoppingList((prev) => [
          ...prev,
          {
            id: data.item._id,
            name: data.item.itemName,
            quantity: data.item.qty,
            averageDays: data.item.days,
            purchaseDate: new Date(data.item.purchaseDate),
          },
        ]);
      } else {
        console.error('Server Error:', data.error);
        Alert.alert('Error', 'Failed to save shopping item.');
      }
    } catch (error) {
      console.error('Error adding shopping item:', error);
      Alert.alert('Error', 'Failed to save the shopping item.');
    }
  };

  // Remove item from shopping list
  const handleRemovePersonalItem = async (id: string) => {
    try {
      const response = await fetch(`${config.SERVER_API}/personal-items/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setPersonalList((prev) => prev.filter((item) => item._id !== id));
      } else {
        const data = await response.json();
        console.error('Server Error:', data.error);
        Alert.alert('Error', 'Failed to delete personal item.');
      }
    } catch (error) {
      console.error('Error deleting personal item:', error);
      Alert.alert('Error', 'Failed to delete the personal item.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isShoppingList ? 'Shopping List' : 'Personal List'}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.switchButton, isShoppingList && styles.activeButton]}
          onPress={() => setIsShoppingList(true)}
        >
          <Text style={[styles.switchButtonText, isShoppingList && styles.activeButtonText]}>Shopping List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, !isShoppingList && styles.activeButton]}
          onPress={() => setIsShoppingList(false)}
        >
          <Text style={[styles.switchButtonText, !isShoppingList && styles.activeButtonText]}>Personal List</Text>
        </TouchableOpacity>
      </View>
      {isShoppingList ? (
        <ShoppingList
          items={shoppingList}
          onAddItem={() => setModalVisible(true)}
          onRemoveAll={() => setShoppingList([])}
          onRemoveItem={handleRemovePersonalItem}
        />
      ) : (
        <PersonalList
          items={personalList}
          onAddItem={() => setModalVisible(true)}
          onRemoveAll={() => setPersonalList([])}
          // onRemoveItem={(id) => setPersonalList((prev) => prev.filter((item) => item.id !== id))}
         onRemoveItem={handleRemovePersonalItem}

        />
      )}
      <ItemInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddItem={(name, quantity, averageDays) =>
          isShoppingList ? handleAddShoppingItem(name, quantity, averageDays) : handleAddPersonalItem(name)
        }
        isShoppingList={isShoppingList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#DF6316' },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  switchButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, borderWidth: 1, borderColor: '#DF6316' },
  activeButton: { backgroundColor: '#DF6316' },
  switchButtonText: { fontSize: 16, color: '#DF6316' },
  activeButtonText: { color: '#fff' },
});
