import { StyleOf } from "@reconjs/react"
import { Icon } from "./icon"

const COLOR = "rgb(111, 134, 159)"

export function IconButton (props: {
	onClick?: () => void,
	style?: StyleOf <"button">,
	path: string,
	label?: string,
	className?: string,
}) {
	return (
		<button
			onClick={props.onClick}
			style={props.style}
			className={`
				flex flex-row items-center justify-center
				rounded-full text-[${COLOR}] text-sm font-bold
				overflow-hidden
				hover:bg-[rgb(241,243,245)]
				${props.className || ""}
			`.trim()}
		>
			<Icon path={props.path} fill={COLOR} size={18} />
			{props.label && (
				<span className="text-[14px] text-[rgb(111,134,159)]">
					&nbsp;{props.label}
				</span>
			)}
		</button>
	)
}
