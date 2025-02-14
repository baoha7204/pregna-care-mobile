import { StyleSheet, Text } from "react-native";
import { Button } from "@ant-design/react-native";

import useSession from "@/hooks/useSession";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { signOut } = useSession();

  return (
    <SafeAreaView>
      <Text>Profile Screen</Text>
      <Button onPress={signOut}>Sign Out</Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ProfileScreen;
