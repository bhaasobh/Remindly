import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ShoppingList } from '@/components/ShoppingList';
import { PersonalList } from '@/components/PersonalList';
import { ItemInputModal } from '@/components/ItemInputModal';

export default function TabTwoScreen() {
  const [shoppingList, setShoppingList] = useState<
    { name: string; quantity: number; averageDays: number; purchaseDate: Date }[]
  >([]);
  const [personalList, setPersonalList] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isShoppingList, setIsShoppingList] = useState(true);

  // הוספת פריטים לרשימת הקניות
  const handleAddShoppingItem = (name: string, quantity: number, averageDays: number) => {
    const newItem = {
      name,
      quantity,
      averageDays,
      purchaseDate: new Date(), // תאריך קנייה נוכחי
    };
    setShoppingList((prev) => [...prev, newItem]);
  };

  // מעקב אחרי זמן נגמר לפריטים (לפי ימים)
  const checkExpiryDates = useCallback(() => {
    const currentDate = new Date();
    shoppingList.forEach((item) => {
      const timeElapsed = Math.floor(
        (currentDate.getTime() - new Date(item.purchaseDate).getTime()) / (1000 * 60 * 60 * 24) // בדיקה בימים
      );
      if (timeElapsed >= item.averageDays) {
        Alert.alert('Reminder', `${item.name} is running out based on your usage pattern.`);
      }
    });
  }, [shoppingList]);

  // בדיקה יומית (לפי ימים)
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiryDates();
    }, 24 * 60 * 60 * 1000); // בדיקה כל יום

    return () => clearInterval(interval); // ניקוי interval
  }, [checkExpiryDates]);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiryDates();
    }, 60 * 1000); // בדיקה כל דקה

    return () => clearInterval(interval); // ניקוי interval
  }, [checkExpiryDates]);

  // הוספת פריט לבדיקה לדקה אחת
  useEffect(() => {
    handleAddShoppingItem('Milk', 1, 0.0007); // פריט לבדיקה, ייגמר תוך דקה
  }, []); // מבוצע פעם אחת בהרצה
  */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isShoppingList ? 'Shopping List' : 'Personal List'}</Text>

      {/* כפתורי מעבר */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.switchButton, isShoppingList && styles.activeButton]}
          onPress={() => setIsShoppingList(true)}
        >
          <Text style={[styles.switchButtonText, isShoppingList && styles.activeButtonText]}>
            Shopping List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, !isShoppingList && styles.activeButton]}
          onPress={() => setIsShoppingList(false)}
        >
          <Text style={[styles.switchButtonText, !isShoppingList && styles.activeButtonText]}>
            Personal List
          </Text>
        </TouchableOpacity>
      </View>

      {/* רשימה דינמית */}
      {isShoppingList ? (
        <ShoppingList
          items={shoppingList}
          onAddItem={() => setModalVisible(true)}
          onRemoveAll={() => setShoppingList([])}
          onRemoveItem={(index) =>
            setShoppingList((prev) => prev.filter((_, i) => i !== index))
          }
        />
      ) : (
        <PersonalList
          items={personalList}
          onAddItem={() => setModalVisible(true)}
          onRemoveAll={() => setPersonalList([])}
          onRemoveItem={(index) =>
            setPersonalList((prev) => prev.filter((_, i) => i !== index))
          }
        />
      )}

      {/* מודל להוספת פריטים */}
      <ItemInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddItem={(name, quantity, averageDays) =>
          isShoppingList
            ? handleAddShoppingItem(name, quantity, averageDays)
            : setPersonalList((prev) => [...prev, name])
        }
        isShoppingList={isShoppingList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#DF6316',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DF6316',
  },
  activeButton: {
    backgroundColor: '#DF6316',
  },
  switchButtonText: {
    fontSize: 16,
    color: '#DF6316',
  },
  activeButtonText: {
    color: '#fff',
  },
});
