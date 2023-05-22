import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import theme from "../utils/theme";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            initialColorMode={theme.config.initialColorMode}
          />
          <Script
            src="https://kit.fontawesome.com/c6df37c35d.js"
            strategy="afterInteractive"
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
