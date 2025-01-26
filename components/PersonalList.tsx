import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface PersonalListProps {
  items: { _id: string; itemName: string }[]; // Ensure items have a unique 'id'
  onAddItem: () => void;
  onRemoveAll: () => void;
  onRemoveItem: (id: string) => void;
}

export const PersonalList: React.FC<PersonalListProps> = ({
  items,
  onAddItem,
  onRemoveAll,
  onRemoveItem,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.itemName}</Text>
            <TouchableOpacity onPress={() => onRemoveItem(item._id)}>
              <Entypo name="trash" size={20} color="#DF6316" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id} // Unique key for each item
        ListEmptyComponent={<Text style={styles.emptyText}>No items in the personal list</Text>}
      />

      {/* Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert("Delete All Items", "Are you sure you want to clear the personal list?", [
              { text: "Cancel", style: "cancel" },
              { text: "Yes", onPress: onRemoveAll },
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemText: {
    fontSize: 18,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#888",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingBottom: 100,
  },
  addButton: {
    backgroundColor: "#DF6316",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});