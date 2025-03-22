import React, { useState } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import { theme } from "@/styles/theme";
import useFetuses from "@/hooks/useFetuses";
import FetusInputModal from "@/components/Fetus/FetusInputModal";
import { FetusDto } from "@/contexts/fetuses.context";
import FetusItem from "@/components/Fetus/FetusItem";

const ManageFetusScreen = () => {
  const {
    fetuses,
    isAddFetusModalVisible,
    handleEditMode,
    editingFetus,
    handleModalClose,
    handleAddFetus,
    handleEditFetus,
    handleSoftDeleteFetus,
    isLoading,
    fetchFetuses,
  } = useFetuses();

  const handleSave = async (fetusData: FetusDto) => {
    if (!editingFetus) {
      await handleAddFetus(fetusData);
    } else {
      await handleEditFetus(editingFetus.id, fetusData);
    }
    fetchFetuses();
  };

  const handleDelete = async (fetusId: string) => {
    await handleSoftDeleteFetus(fetusId);
    fetchFetuses();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={fetuses}
        renderItem={({ item }) => (
          <FetusItem
            data={item}
            onPress={() => handleEditMode(item)}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
      />
      {editingFetus ? (
        <FetusInputModal
          mode="edit"
          visible={isAddFetusModalVisible}
          fetus={{
            ...editingFetus,
            dueDate: new Date(editingFetus.dueDate * 1000),
          }}
          onClose={handleModalClose}
          onSave={handleSave}
          isLoadingSave={isLoading}
        />
      ) : (
        <FetusInputModal
          mode="add"
          visible={isAddFetusModalVisible}
          onClose={handleModalClose}
          onSave={handleSave}
          isLoadingSave={isLoading}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryLight,
  },
  content: {
    flex: 1,
  },
});

export default ManageFetusScreen;
