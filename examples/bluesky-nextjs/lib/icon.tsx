import { StyleOf } from "@reconjs/react"

export function Icon (props: {
	style?: StyleOf <"svg">,
	path: string,
	fill: string,
	size: number,
}) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			width={props.size}
			height={props.size}
			style={props.style}
			className="inline-block"
		>
			<path 
				fill={props.fill} 
				fillRule="evenodd" 
				clipRule="evenodd" 
				d={props.path}
			/>
		</svg>
	)
}