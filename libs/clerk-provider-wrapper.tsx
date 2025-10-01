import type { PropsWithChildren } from "react";

import { TOKEN_CACHE_STRATEGY } from "@/utils/clerk";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";

const ClerkProviderWrapper = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "no_publishable_key"}
      tokenCache={TOKEN_CACHE_STRATEGY}>
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
