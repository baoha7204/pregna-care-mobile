import React, { useEffect, useState } from "react";
import { createContext, PropsWithChildren } from "react";

import { customAxios } from "@/api/core";
import { FetusGender } from "@/types/user";
import { ApiResponse } from "@/types/core";
import { calculatePregnancyWeek } from "@/utils/core";
import useSession from "@/hooks/useSession";

export type Fetus = {
  id: string;
  name: string;
  dueDate: number;
  gender: FetusGender;
  weeks: number;
};

export type FetusDto = {
  name: string;
  dueDate: number;
  gender: FetusGender;
};

type FetusesContextType = {
  fetuses: Fetus[];
  currentFetus: Fetus | null;
  switchFetus: (fetus: Fetus) => void;
  editingFetus: Fetus | null;
  isAddFetusModalVisible: boolean;
  handleAddFetus: (fetus: FetusDto) => Promise<void>;
  handleEditFetus: (fetusId: string, fetus: FetusDto) => Promise<void>;
  handleSoftDeleteFetus: (fetusId: string) => Promise<void>;
  handleEditMode: (fetus: Fetus) => void;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  isLoading: boolean;
};

const FetusesContext = createContext<FetusesContextType>({
  fetuses: [],
  currentFetus: null,
  switchFetus: () => {},
  editingFetus: null,
  isAddFetusModalVisible: false,
  handleAddFetus: () => Promise.resolve(),
  handleEditFetus: () => Promise.resolve(),
  handleSoftDeleteFetus: () => Promise.resolve(),
  handleEditMode: () => {},
  handleModalOpen: () => {},
  handleModalClose: () => {},
  isLoading: false,
});

const FetusesProvider = ({ children }: PropsWithChildren) => {
  const {
    status: { authenticated },
    isFetchingUser,
  } = useSession();
  const [fetuses, setFetuses] = useState<Fetus[]>([]);
  const [currentFetus, setCurrentFetus] = useState<Fetus | null>(null);
  const [editingFetus, setEditingFetus] = useState<Fetus | null>(null);
  const [isAddFetusModalVisible, setIsAddFetusModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const switchFetus = (fetus: Fetus) => {
    setCurrentFetus(fetus);
  };

  const handleAddFetus = async (fetus: FetusDto) => {
    setIsLoading(true);
    try {
      const res = await customAxios.post("/fetuses/users/create", {
        name: fetus.name,
        dueDate: fetus.dueDate,
        gender: fetus.gender,
      });

      const addedFetus = res.data.data;
      const weeks = calculatePregnancyWeek(addedFetus.dueDate, new Date());

      setFetuses([...fetuses, { ...addedFetus, weeks }]);
    } catch (error) {
      console.error("Failed to add fetus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFetus = async (fetusId: string, fetus: FetusDto) => {
    setIsLoading(true);
    try {
      const res = await customAxios.put(`/fetuses/users/${fetusId}`, {
        name: fetus.name,
        dueDate: fetus.dueDate,
        gender: fetus.gender,
      });
      const updatedFetus = res.data.data;
      const updatedFetuses = fetuses.map((f) => {
        if (f.id === updatedFetus.id) {
          const weeks = calculatePregnancyWeek(
            updatedFetus.dueDate,
            new Date()
          );
          return { ...updatedFetus, weeks };
        }
        return f;
      });
      setFetuses(updatedFetuses);
    } catch (error) {
      console.error("Failed to edit fetus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoftDeleteFetus = async (fetusId: string) => {
    try {
      await customAxios.delete(`/fetuses/users/soft-delete/${fetusId}`);
      setFetuses(fetuses.filter((fetus) => fetus.id !== fetusId));
    } catch (error) {
      console.error("Failed to delete fetus:", error);
    }
  };

  const handleEditMode = (fetus: Fetus) => {
    setEditingFetus(fetus);
    setIsAddFetusModalVisible(true);
  };

  const handleModalOpen = () => {
    setIsAddFetusModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingFetus(null);
    setIsAddFetusModalVisible(false);
  };

  useEffect(() => {
    const fetchFetuses = async () => {
      try {
        const result = await customAxios.get<ApiResponse<Fetus[]>>(
          "/fetuses/users"
        );

        // caclulate pregnancy weeks
        let fetuses = result.data.data;
        if (fetuses) {
          fetuses = fetuses.map((fetus) => {
            const weeks = calculatePregnancyWeek(fetus.dueDate, new Date());
            return { ...fetus, weeks };
          });
          setCurrentFetus(fetuses[0]);
          setFetuses(fetuses);
        }
      } catch (error) {
        console.error("Failed to fetch fetuses:", error);
      }
    };

    if (authenticated && !isFetchingUser) {
      fetchFetuses();
    }
  }, [authenticated, isFetchingUser]);

  return (
    <FetusesContext.Provider
      value={{
        fetuses,
        currentFetus,
        switchFetus,
        editingFetus,
        isAddFetusModalVisible,
        handleAddFetus,
        handleEditFetus,
        handleSoftDeleteFetus,
        handleEditMode,
        handleModalOpen,
        handleModalClose,
        isLoading,
      }}
    >
      {children}
    </FetusesContext.Provider>
  );
};

export { FetusesContext, FetusesProvider };
