import {FlatListComponent} from 'react-native'
import Animated from 'react-native-reanimated'
import {FlatListPropsWithLayout} from 'react-native-reanimated'

// If you explode these into functions, don't forget to forwardRef!

/**
 * Avoid using `FlatList_INTERNAL` and use `List` where possible.
 * The types are a bit wrong on `FlatList_INTERNAL`
 */
export const FlatList_INTERNAL = Animated.FlatList
export type FlatList_INTERNAL<ItemT = any> = Omit<
  FlatListComponent<ItemT, FlatListPropsWithLayout<ItemT>>,
  'CellRendererComponent'
>