import { ComponentType, JSX } from "react"

export type Component <T = any> = ComponentType<T>

export type PropsOf <C extends Component> = 
  JSX.LibraryManagedAttributes <C, React.ComponentPropsWithoutRef<C>>

export type StyleOf <C extends Component> = PropsOf<C>["style"]