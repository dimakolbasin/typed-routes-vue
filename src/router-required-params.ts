import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & {
  name: string
  children?: readonly AppRouteRecord[]
}

type GetRouteName<T extends AppRouteRecord> =
  T extends { children: readonly AppRouteRecord[] }
    ? T['name'] | GetRoutesNames<T['children']>
    : T['name']
type GetRoutesNames<T extends readonly AppRouteRecord[]> = GetRouteName<T[number]>

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('~/components/RouteName.vue'),
  },
  {
    name: 'catalog.list',
    path: '/catalog',
    component: () => import('~/components/RouteName.vue'),
  },
  {
    name: 'catalog.item',
    path: '/catalog/:id',
    component: () => import('~/components/RouteName.vue'),
    children: [
      {
        name: 'catalog.item.reviews',
        path: '/catalog/:id/reviews',
        component: () => import('~/components/RouteName.vue'),
      },
    ],
  },
] as const satisfies readonly AppRouteRecord[]

type TRoutes = typeof routes
export type TRouteNames = GetRoutesNames<TRoutes>

// Helper type to extract parameters from the route path
type ExtractRouteParams<Path extends string> =
  Path extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param extends 'id'
      ? { id: string } & ExtractRouteParams<Rest>
      : { [K in Param]: string } & ExtractRouteParams<Rest>
    : Path extends `${infer _Start}:${infer Param}`
      ? Param extends 'id'
        ? { id: string }
        : { [K in Param]: string }
      : {}

type RouteParamsForName<Name extends TRouteNames, Routes extends readonly AppRouteRecord[] = TRoutes> =
  Routes extends readonly (infer R)[]
    ? R extends { name: Name, path: infer Path }
      ? ExtractRouteParams<Path & string>
      : R extends { children: readonly AppRouteRecord[] }
        ? RouteParamsForName<Name, R['children']>
        : never
    : never

type OptionalIfNoParams<T> = keyof T extends never ? { params?: T } : { params: T }

export type TRouteTo<Name extends TRouteNames = TRouteNames> = {
  name: Name
} & OptionalIfNoParams<RouteParamsForName<Name>>

const router = createRouter({
  routes: routes as unknown as RouteRecordRaw[],
  history: createWebHistory('/'),
})

export const getLink = <Name extends TRouteNames>(to: TRouteTo<Name>) => {
  return to
}

// Example usage
getLink({ name: 'catalog.item', params: { id: 'value' } })
getLink({ name: 'home' })
// Compilation error: the parameter should be 'id', not 'idx'
// getLink({ name: 'catalog.item', params: { idx: 'value' } })

// Example usage
getLink({ name: 'catalog.item.reviews', params: { id: '1' } })
// Compilation error: the parameter should be 'id', not 'idx'
// getLink({ name: 'catalog.item.reviews', params: { idx: '1' } })

export default router
