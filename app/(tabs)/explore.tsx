import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function TabTwoScreen() {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // הוספת פריט לרשימה
  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue]);
      setInputValue('');
      setModalVisible(false);
    }
  };

  // מחיקת פריט
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <View style={styles.container}>
      {/* כותרת וכפתור הוספה */}
      <View style={styles.header}>
        <Text style={styles.title}>personal items</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Entypo name="plus" size={30} color="#DF6316" />
        </TouchableOpacity>
      </View>

      {/* רשימת הפריטים */}
      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(index)}>
              <Entypo name="trash" size={20} color="#DF6316" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>empty</Text>}
      />

      {/* מודל להוספת פריט חדש */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>add item</Text>
            <TextInput
              style={styles.input}
              placeholder="הכנס פריט"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// סגנון ועיצוב
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DF6316',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#DF6316',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DF6316',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#DF6316',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelButton: {
    marginTop: 15,
    color: '#DF6316',
    fontSize: 16,
  },
});
