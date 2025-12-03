import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { SquircleButton } from "expo-squircle-view";
import { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PremiumBottomSheetModalProps = {
  onRequestClose?: () => void;
  onPurchasePress?: () => void;
};

export const PremiumBottomSheetModal = forwardRef<BottomSheetModal, PremiumBottomSheetModalProps>(
  ({ onRequestClose, onPurchasePress }, ref) => {
    const snapPoints = useMemo(() => ["80%"], []);
    const { bottom } = useSafeAreaInsets();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="none"
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        footerComponent={() => (
          <View style={[styles.buttonContainer, { paddingBottom: bottom }]}>
            <SquircleButton
              style={styles.purchaseButton}
              activeOpacity={0.8}
              onPress={onPurchasePress}>
              <Text style={styles.purchaseButtonText}>Purchase premium</Text>
            </SquircleButton>
          </View>
        )}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            margin: 16,
            paddingBottom: 60,
            gap: 32,
          }}>
          <View style={styles.header}>
            <View>
              <Text style={styles.subtitle}>Unlock more practice</Text>
              <Text style={styles.title}>Premium membership</Text>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={onRequestClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scroll}>
            <View style={styles.fakeSection}>
              <Text style={styles.sectionTitle}>Fake feature #1</Text>
              <Text style={styles.sectionDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae arcu in
                lectus mollis placerat. Nunc tempor nisi sed hendrerit tristique.
              </Text>
            </View>
            <View style={styles.fakeSection}>
              <Text style={styles.sectionTitle}>Fake feature #2</Text>
              <Text style={styles.sectionDescription}>
                Phasellus interdum turpis metus, in posuere lectus dapibus et. Duis mollis nunc non
                aliquet ornare. In aliquet velit vel dui placerat, id convallis dui gravida.
              </Text>
            </View>
            <View style={styles.fakeSection}>
              <Text style={styles.sectionTitle}>Fake feature #3</Text>
              <Text style={styles.sectionDescription}>
                Donec ac erat metus. Mauris dapibus tellus nec sem suscipit, ac euismod dui tempor.
                Sed consequat, augue ut lacinia interdum, nisl urna convallis mi, ut pharetra augue
                lectus ut arcu.
              </Text>
            </View>
            <View style={styles.fakeSection}>
              <Text style={styles.sectionTitle}>Fake feature #4</Text>
              <Text style={styles.sectionDescription}>
                Curabitur in ultricies magna. Sed a arcu sit amet massa semper egestas. Integer
                lacinia leo ac massa cursus finibus.
              </Text>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

PremiumBottomSheetModal.displayName = "PremiumBottomSheetModal";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  subtitle: {
    ...defaultStyles.textS,
    color: Colors.slate500,
    textTransform: "uppercase",
  },
  title: {
    ...defaultStyles.textXXL,
    ...defaultStyles.textBold,
    color: Colors.dark,
    marginTop: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  cancelButtonText: {
    ...defaultStyles.textL,
    color: Colors.slate500,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 16,
  },
  fakeSection: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.slate50,
    gap: 8,
  },
  sectionTitle: {
    ...defaultStyles.textBold,
    color: Colors.dark,
  },
  sectionDescription: { color: Colors.slate500 },
  buttonContainer: { marginHorizontal: 16 },
  purchaseButton: {
    height: 50,
    backgroundColor: Colors.primary500,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  purchaseButtonText: {
    ...defaultStyles.textBold,
    color: Colors.background,
  },
});
