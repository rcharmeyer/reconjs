"use client"
import { 
	ComponentType,
	createContext,
	memo, 
	MemoExoticComponent, 
	PropsWithChildren,
} from "react"

type Wrapper = MemoExoticComponent <ComponentType <PropsWithChildren>>

type HoistedProvider = Wrapper & {
	attach: (provider: Wrapper) => void
}

export function createProvider (displayName: string) {
	let locked = false
	const providers = [] as Wrapper[]

	function HoistedProvider (props: PropsWithChildren) {
		locked = true
		let res = props.children

		for (const InnerProvider of providers) {
			res = <InnerProvider>{res}</InnerProvider>
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
		
		providers.unshift (provider)
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
