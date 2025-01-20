import { StyleOf } from "@reconjs/react"
import Svg, { Path } from "react-native-svg"

export function Icon (props: {
	style?: StyleOf <typeof Svg>,
	path: string,
	fill: string,
	size: number,
}) {
	return (
		<Svg
			fill="none"
			viewBox="0 0 24 24"
			width={props.size}
			height={props.size}
			style={props.style}
		>
			<Path 
				fill={props.fill} 
				fillRule="evenodd" 
				clipRule="evenodd" 
				d={props.path}
			/>
		</Svg>
	)
}