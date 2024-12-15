"use client"
import { 
	ComponentType,
	createContext,
	memo, 
	MemoExoticComponent, 
	PropsWithChildren,
} from "react"

type Wrapper = ComponentType <PropsWithChildren>

type HoistedProvider = MemoExoticComponent <Wrapper> & {
	attach: (provider: Wrapper) => void
}

export function createProvider (displayName: string) {
	let locked = false
	const wrappers = [] as Wrapper[]

	function HoistedProvider (props: PropsWithChildren) {
		locked = true
		let res = props.children

		for (const Wrapper of wrappers) {
			res = <Wrapper>{res}</Wrapper>
		}

		return res
	}

	HoistedProvider.displayName = displayName

	const res: any = memo (HoistedProvider)
	res.attach = function attach (provider: Wrapper) {
		if (locked) {
			console.error ("Cannot attach to a Provider after it has been locked")
			return
		}
		
		wrappers.unshift (provider)
	}
	return res as HoistedProvider
}

export const RootProvider = createProvider ("RootProvider")

export function defineContext <T> (
	displayName: string,
	factory: () => T, 
	deps: HoistedProvider[] = [ RootProvider ]
) {
	const context = createContext<T> (undefined as any)
	context.displayName = `${displayName}.Context`

	const Provider = memo (context.Provider)

	function HoistedContext (props: PropsWithChildren) {
		const value = factory()
		return (
			<Provider value={value}>
				{props.children}
			</Provider>
		)
	}

	HoistedContext.displayName = `${displayName}.Provider`

	for (const dep of deps) {
		dep.attach (memo (HoistedContext))
	}

	return context
}
