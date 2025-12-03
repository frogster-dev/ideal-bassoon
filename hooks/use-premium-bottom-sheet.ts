import { PremiumBottomSheetContext } from "@/providers/premium-bottom-sheet-provider";
import { useContext } from "react";

export const usePremiumBottomSheet = () => {
  const context = useContext(PremiumBottomSheetContext);

  if (!context) {
    throw new Error("usePremiumBottomSheet must be used within a PremiumBottomSheetProvider");
  }

  return context;
};
