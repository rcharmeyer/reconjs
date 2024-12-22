import { Provider } from "./provider"
import { theRoot } from "./root"

export function RootProvider (props: {
	children: React.ReactNode,
}) {
	return (
		<Provider context={theRoot} value={null}>
			{props.children}
		</Provider>
	)
}