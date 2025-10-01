import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface UserPublicMetadata {
  consentToBudget: boolean;
  hasPincode: boolean;
  newTransferIntoDefault?: number;
}

export function extractNewTransferValue(
  metadata: UserPublicMetadata | undefined | null,
): number | undefined {
  if (!metadata) return undefined;

  const clerkValue = metadata.newTransferIntoDefault;

  if (typeof clerkValue === "number" && clerkValue) {
    return clerkValue;
  }

  return undefined;
}

function createTokenCache() {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("secure store get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: (key: string, token: string) => {
      return SecureStore.setItemAsync(key, token);
    },
  };
}

/**
 * @note SecureStore is not supported on the web
 */
export const TOKEN_CACHE_STRATEGY = Platform.OS !== "web" ? createTokenCache() : undefined;
