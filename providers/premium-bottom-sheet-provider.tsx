import { PremiumBottomSheetModal } from "@/components/premium-bottom-sheet-modal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { PropsWithChildren, createContext, useCallback, useMemo, useRef } from "react";

type PremiumBottomSheetContextValue = {
  openPremiumSheet: () => void;
  closePremiumSheet: () => void;
};

export const PremiumBottomSheetContext = createContext<PremiumBottomSheetContextValue | null>(null);

export const PremiumBottomSheetProvider = ({ children }: PropsWithChildren) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openPremiumSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const closePremiumSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const contextValue = useMemo(
    () => ({
      openPremiumSheet,
      closePremiumSheet,
    }),
    [closePremiumSheet, openPremiumSheet],
  );

  return (
    <PremiumBottomSheetContext.Provider value={contextValue}>
      {children}
      <PremiumBottomSheetModal ref={bottomSheetRef} onRequestClose={closePremiumSheet} />
    </PremiumBottomSheetContext.Provider>
  );
};
