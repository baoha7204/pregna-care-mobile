import React, { useEffect, useState, useContext } from "react";
import { createContext, PropsWithChildren } from "react";
import { Platform } from "react-native";
import { customAxios } from "@/api/core";
import useSession from "@/hooks/useSession";

// Define user types
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  bloodType: string;
  dateOfBirth: number;
  avatarUrl?: string;
};

export type UserProfileUpdate = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationality: string;
  bloodType: string;
  dateOfBirth: number;
};

type UsersContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (userData: UserProfileUpdate) => Promise<User>;
  uploadAvatar: (imageUri: string) => Promise<any>;
  getUserProfile: () => Promise<User>;
};

const UsersContext = createContext<UsersContextType>({
  user: null,
  isLoading: false,
  error: null,
  updateProfile: () => Promise.resolve({} as User),
  uploadAvatar: () => Promise.resolve({}),
  getUserProfile: () => Promise.resolve({} as User),
});

const UsersProvider = ({ children }: PropsWithChildren) => {
  const {
    status: { session, authenticated },
    isFetchingUser,
  } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configure axios with the current auth token
  useEffect(() => {
    if (session) {
      customAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session}`;
    } else {
      delete customAxios.defaults.headers.common["Authorization"];
    }
  }, [session]);

  // Function to store user data
  const setUserData = (userData: User) => {
    setUser(userData);
  };

  /**
   * Update user profile information with proper error handling
   */
  const updateProfile = async (userData: UserProfileUpdate): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!session) {
        throw new Error("Authentication required");
      }

      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await customAxios.put("/users/profile", userData, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response has the expected structure
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response from server");
      }

      const updatedUser = response.data.data;
      setUser(updatedUser);

      return updatedUser;
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = "Failed to update profile";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Upload user avatar with improved error handling
   */
  const uploadAvatar = async (imageUri: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!session) {
        throw new Error("Authentication required");
      }

      // Create form data
      const formData = new FormData();

      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";

      // Thay đổi tên trường từ 'avatar' thành 'file' hoặc tên trường mà server mong đợi
      formData.append("file", {
        // Thử dùng 'file' thay vì 'avatar'
        uri:
          Platform.OS === "android"
            ? imageUri
            : imageUri.replace("file://", ""),
        name: filename,
        type,
      } as any);

      // Thử gọi API với phương thức POST thay vì PUT
      const response = await customAxios.put("/users/avatar/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000, // Thiết lập timeout thay vì dùng AbortController
      });

      // Kiểm tra cấu trúc response
      let responseData;
      if (response.data?.data) {
        responseData = response.data.data;
      } else if (response.data) {
        responseData = response.data;
      } else {
        throw new Error("Invalid response from server");
      }

      // Cập nhật trạng thái người dùng với URL avatar mới
      if (user && responseData.avatarUrl) {
        const updatedUser = {
          ...user,
          avatarUrl: responseData.avatarUrl,
        };
        setUser(updatedUser);
      }

      return responseData;
    } catch (error: any) {
      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Failed to upload avatar";

      if (error.response) {
        // Log toàn bộ response để debug

        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get current user profile with improved error handling
   */
  const getUserProfile = async (): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!session) {
        throw new Error("Authentication required");
      }

      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await customAxios.get("/users/self", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response has the expected structure
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response from server");
      }

      const userProfile = response.data.data;
      setUser(userProfile);

      return userProfile;
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = "Failed to get user profile";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;

        // Specific handling for common errors
        if (error.response.status === 403) {
          errorMessage = "Access denied. You may need to log in again.";
        } else if (error.response.status === 404) {
          errorMessage = "User profile not found.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user profile when context is mounted - with better error handling
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        if (authenticated && !user && !isFetchingUser && session) {
          await getUserProfile();
        }
      } catch (error) {
        // Only set error state if component is still mounted
        if (isMounted) {
          setError("Could not load user profile. Please try again later.");
        }
      }
    };

    fetchProfile();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [authenticated, isFetchingUser, session]);

  return (
    <UsersContext.Provider
      value={{
        user,
        isLoading,
        error,
        updateProfile,
        uploadAvatar,
        getUserProfile,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export { UsersContext, UsersProvider };
