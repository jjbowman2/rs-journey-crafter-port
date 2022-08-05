import { NextPage } from "next";

/**
 * Authentication configuration
 */
export interface AuthEnabledComponentConfig {
	authenticationEnabled: boolean;
}

/**
 * A component with authentication configuration
 */
export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> &
	AuthEnabledComponentConfig;

export type PageWithAuth = NextPage & AuthEnabledComponentConfig;
