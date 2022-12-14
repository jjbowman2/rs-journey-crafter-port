// src/pages/_app.tsx
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter";
import { withTRPC } from "@trpc/next";
import { SessionProvider, useSession } from "next-auth/react";
import type {
	AppPropsType,
	AppType,
	NextComponentType,
	NextPageContext,
} from "next/dist/shared/lib/utils";
import { ReactQueryDevtools } from "react-query/devtools";
import superjson from "superjson";
import Header from "../components/header";
import LoadingIndicator from "../components/loading-indicator";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import { AuthEnabledComponentConfig } from "../utils/auth.utils";
import theme from "../utils/theme";

type AppAuthProps = AppPropsType & {
	Component: NextComponentType<NextPageContext, any, {}> &
		Partial<AuthEnabledComponentConfig>;
};

const MyApp: AppType = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppAuthProps) => {
	return (
		<SessionProvider session={session}>
			<ChakraProvider theme={theme}>
				<Header />
				{Component.authenticationEnabled ? (
					<Auth>
						<Component {...pageProps} />
					</Auth>
				) : (
					<Component {...pageProps} />
				)}
				<ReactQueryDevtools />
			</ChakraProvider>
		</SessionProvider>
	);
};

const Auth: React.FC<any> = ({ children }) => {
	// if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
	const { status } = useSession({ required: true });

	if (status === "loading") {
		return <LoadingIndicator />;
	}

	return children;
};

const getBaseUrl = () => {
	if (typeof window !== "undefined") {
		return "";
	}
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
