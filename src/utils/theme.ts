// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { GlobalProps } from "@emotion/react";

// 2. Add your color mode config
const config: ThemeConfig = {
	initialColorMode: "system",
	useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({
	config,
	styles: {
		global: (props: GlobalProps) => ({
			body: {
				bg: mode(
					"linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
					"linear-gradient(60deg, #29323c 0%, #485563 100%)"
				)(props),
				minHeight: "100vh",
			},
		}),
	},
	fonts: {
		heading: "Inter, sans-serif",
		body: "Inter, sans-serif",
	},
});

export default theme;
