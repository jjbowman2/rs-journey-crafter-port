import { Progress } from "@chakra-ui/react";

export default function LoadingIndicator() {
	return (
		<Progress
			size="sm"
			position="fixed"
			left="0"
			bottom="0"
			w="100vw"
			colorScheme="orange"
			isIndeterminate
		/>
	);
}
