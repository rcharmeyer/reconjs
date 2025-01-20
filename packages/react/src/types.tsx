import { ComponentPropsWithoutRef, ElementType, JSX } from "react"

export type PropsOf <C extends ElementType> = 
  JSX.LibraryManagedAttributes <C, ComponentPropsWithoutRef<C>>

export type StyleOf <C extends ElementType> = PropsOf<C>["style"]