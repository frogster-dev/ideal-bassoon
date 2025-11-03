import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { useUser } from "@clerk/clerk-expo";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Header = () => {
  const { top } = useSafeAreaInsets();
  const { user } = useUser();

  return (
    <View style={[styles.container, { paddingTop: top + 16 }]}>
      <View>
        <Text style={styles.greeting}>Bonjour,</Text>
        <Text style={styles.userName}>{user?.firstName || ""}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.primary700,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary500,
  },
  greeting: { color: Colors.background },
  userName: {
    ...defaultStyles.textXL,
    ...defaultStyles.textBold,
    color: Colors.background,
    marginTop: 4,
  },
});
