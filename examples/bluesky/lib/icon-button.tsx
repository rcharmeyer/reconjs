import { withStyle } from "@reconjs/react"
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from "react-native"
import { Icon } from "./icon"

const COLOR = "rgb(111, 134, 159)"

const ButtonText = withStyle (Text, {
	color: COLOR,
	fontSize: 14,
	letterSpacing: 0,
})

const styles = StyleSheet.create ({
	button: {
		alignItems: "center",
		borderRadius: 9999,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		overflow: "hidden",
		color: COLOR,
		fontSize: 12,
		fontWeight: "bold",
	},
	hovered: {
		backgroundColor: "rgb(241, 243, 245)",
	}
})

export function IconButton (props: Omit <PressableProps, "children"|"style"> & {
	style?: ViewStyle,
	path: string,
	label?: string,
}) {
	return (
		<Pressable {...props} 
			style={({ hovered }) => [
				props.style, 
				styles.button, 
				hovered && styles.hovered,
			]}
		>
			<Icon path={props.path} fill={COLOR} size={18} />
			{props.label && (
				<ButtonText>
					&nbsp;{props.label}
				</ButtonText>
			)}
		</Pressable>
	)
}
