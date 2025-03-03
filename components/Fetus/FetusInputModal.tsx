import React, { FC, useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  ActionSheet,
  ActivityIndicator,
  Card,
  View,
} from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";

import { FetusGender } from "@/types/user";
import { theme } from "@/styles/theme";
import { genderOptions } from "@/data/gender";
import { FetusDto } from "@/contexts/fetuses.context";

const initialFetusData: Omit<FetusInputData, "id"> = {
  name: "",
  dueDate: new Date(),
  gender: FetusGender.Unknown,
};

export type FetusInputData = {
  id: string;
  name: string;
  dueDate: Date;
  gender: FetusGender;
};

type FetusInputModalProps = {
  mode: "add" | "edit";
  fetus?: FetusInputData;
  isLoadingSave: boolean;
  visible: boolean;
  onClose: () => void;
  onSave: (fetusData: FetusDto) => Promise<void>;
};

const FetusInputModal: FC<FetusInputModalProps> = ({
  mode,
  visible,
  onClose,
  onSave,
  fetus,
  isLoadingSave,
}) => {
  const isEdit = useMemo(() => mode === "edit", [mode]);
  const [data, setData] =
    useState<Omit<FetusInputData, "id">>(initialFetusData);

  const handleChange = (
    key: keyof Omit<FetusInputData, "id">,
    value: string | Date
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const showGenderActionSheet = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: genderOptions,
        cancelButtonIndex: 3,
        title: "Select Baby's Gender",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) handleChange("gender", FetusGender.Male);
        else if (buttonIndex === 1) handleChange("gender", FetusGender.Female);
        else if (buttonIndex === 2) handleChange("gender", FetusGender.Unknown);
      }
    );
  };

  const handleSave = async () => {
    await onSave({
      name: data.name,
      dueDate: Math.round(data.dueDate.getTime() / 1000),
      gender: data.gender,
    });
    if (!isEdit) setData(initialFetusData);
    onClose();
  };

  useEffect(() => {
    if (isEdit && fetus) {
      setData({
        name: fetus.name,
        dueDate: fetus.dueDate,
        gender: fetus.gender,
      });
    } else {
      setData(initialFetusData);
    }
  }, [isEdit, fetus]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? "Edit fetus" : "Add new fetus"}
            </Text>
            <View style={styles.options}>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color={theme.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          <Card style={styles.card}>
            <Card.Body>
              <View style={styles.cardBody}>
                {/* <View style={styles.avatarSection}>
                  <AvatarPicker avatar={avatar} onAvatarChange={setAvatar} />
                </View> */}

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Baby's name</Text>
                  <TextInput
                    value={data.name}
                    onChangeText={(value) => handleChange("name", value)}
                    placeholder="Enter baby's name"
                    autoCorrect={false}
                    autoComplete="off"
                    style={styles.input}
                  />

                  <Text style={styles.inputLabel}>Due date</Text>
                  <DateTimePicker
                    value={data.dueDate}
                    mode="date"
                    onChange={(_, date) => {
                      if (date) handleChange("dueDate", date);
                    }}
                    accentColor={theme.primary}
                  />

                  <Text style={styles.inputLabel}>Baby's gender</Text>
                  <TouchableOpacity
                    style={styles.genderSelector}
                    onPress={showGenderActionSheet}
                  >
                    <Text style={styles.genderText}>{data.gender}</Text>
                    <Feather
                      name="chevron-down"
                      size={20}
                      color={theme.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Body>
          </Card>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoadingSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <ActivityIndicator
            size="large"
            color={theme.primary}
            animating={isLoadingSave}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  options: {
    flexDirection: "row",
    gap: 20,
  },
  card: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  closeButton: {
    padding: 8,
  },
  cardBody: {
    padding: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    backgroundColor: "#CCFF90",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  inputSection: {
    flexDirection: "column",
    gap: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.secondary,
  },
  input: {
    fontSize: 16,
    height: 48,
    borderWidth: 2,
    borderColor: theme.borderPrimary,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: theme.secondary,
  },
  genderSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.borderPrimary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  genderText: {
    fontSize: 16,
    color: theme.secondary,
    textTransform: "capitalize",
  },
  saveButton: {
    marginHorizontal: 16,
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FetusInputModal;
