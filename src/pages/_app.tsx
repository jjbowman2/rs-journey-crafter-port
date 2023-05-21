// src/pages/_app.tsx
import { ChakraProvider } from "@chakra-ui/react";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import "@fontsource/inter";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Header from "../components/header";
import "../styles/globals.css";
import theme from "../utils/theme";

const publicPages = ["/welcome"];

const MyApp = ({ Component, pageProps }: AppProps) => {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider theme={theme}>
        <Header />
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
      </ChakraProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
