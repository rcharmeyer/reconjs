import { Context, FunctionComponent, memo, useDebugValue } from "react"
import { Provider } from "./provider"

type ContextMapping <K extends string = string> = Record <K, Context<any>>
type PropsOf <C extends FunctionComponent <any>> = Parameters<C>[0]

/**
 * A utility to easily provide multiple contexts by intercepting props.
 * 
 * @param component - The component to wrap.
 * @param contexts - The prop-context mapping.
 * @returns The wrapped component.
 * 
 * @example
 * import { createContext, useContext } from "react"
 * import { withProviders } from "@reconjs/react"
 * 
 * const theUser = createContext (null)
 * 
 * function AccountPageContent ({ style }) {
 *   const user = useContext (theUser)
 *   // ...
 * }
 * 
 * const PageContent = withProviders (AccountPageContent, {
 *   user: theUser,
 * })
 * 
 * function AccountPage ({ style, user }) {
 *   return <PageContent style={style} user={user} />
 * }
 */
export function withProviders <
  C extends FunctionComponent <any>,
	M extends ContextMapping <Exclude <string, keyof PropsOf<C>>>
> (component: C, contexts: M) {
	type AllProps = PropsOf<C> & {
		[K in keyof M]: M[K] extends Context<infer V> ? V : never
	}

	const Component = memo (component)

	function useMapping() {
		useDebugValue(contexts)
		return contexts
	}

	function useChildProps (allProps: any, mapping: ContextMapping) {
		const childProps = { ...allProps }
		for (const key of Object.keys (mapping)) {
			delete childProps[key]
		}
		return childProps
	}

	function useProviders (allProps: any, mapping: ContextMapping) {
		const providers = [] as Array <{
			context: Context<any>
			value: any
		}>

		for (const key of Object.keys (mapping)) {
			const context: Context<any> = (mapping as any)[key]
			const value = allProps[key]
			providers.push({ context, value })
		}

		return providers
	}

	function WithProviders (allProps: any) {
		// @ts-expect-error
		if (!WithProviders.displayName) {
			// @ts-expect-error
			WithProviders.displayName = `withProviders(${Component.displayName})`
		}

		const mapping = useMapping()
		const childProps = useChildProps(allProps, mapping)
		const providers = useProviders(allProps, mapping)

		let result = <Component {...childProps} />

		for (const { context, value } of providers) {
			result = (
				<Provider context={context} value={value}>
					{result}
				</Provider>
			)
		}

		return result
	}

	return memo (WithProviders as FunctionComponent<AllProps>)
}