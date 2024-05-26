import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const NO_REQUIRED_PARAM_MARK = '(.*)'
const CHILDREN_ROUTE = 'children'
const NAME_ROUTE = 'name'

type AppRouteRecord = Omit<RouteRecordRaw, typeof NAME_ROUTE | typeof CHILDREN_ROUTE> & {
  name: string
  [CHILDREN_ROUTE]?: readonly AppRouteRecord[]
}

type GetRouteName<T extends AppRouteRecord> =
  T extends { [CHILDREN_ROUTE]: readonly AppRouteRecord[] }
    ? T[typeof NAME_ROUTE] | GetRoutesNames<T[typeof CHILDREN_ROUTE]>
    : T[typeof NAME_ROUTE]
type GetRoutesNames<T extends readonly AppRouteRecord[]> = GetRouteName<T[number]>

const routes = [
  {
    name: 'home',
    path: '/:city-url(.*)',
    component: () => import('~/components/RouteName.vue'),
  },
  {
    name: 'catalog.list',
    path: '/catalog/:city-url(.*)',
    component: () => import('~/components/RouteName.vue'),
  },
  {
    name: 'catalog.item',
    path: '/catalog/:city-url(.*)/:id',
    component: () => import('~/components/RouteName.vue'),
    children: [
      {
        name: 'catalog.item.reviews',
        path: '/catalog/:city-url(.*)/:id/reviews',
        component: () => import('~/components/RouteName.vue'),
      },
    ],
  },
] as const satisfies readonly AppRouteRecord[]

type TRoutes = typeof routes
export type TRouteNames = GetRoutesNames<TRoutes>

// Helper type to extract parameters from the route path
type ExtractRouteParams<Path extends string> =
  Path extends `${infer _Start}:${infer Param}${typeof NO_REQUIRED_PARAM_MARK}/${infer Rest}`
    ? { [K in Param]?: string } & ExtractRouteParams<`/${Rest}`>
    : Path extends `${infer _Start}:${infer Param}${typeof NO_REQUIRED_PARAM_MARK}`
      ? { [K in Param]?: string }
      : Path extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [K in Param]: string } & ExtractRouteParams<`/${Rest}`>
        : Path extends `${infer _Start}:${infer Param}`
          ? { [K in Param]: string }
          : {}

type RouteParamsForName<Name extends TRouteNames, Routes extends readonly AppRouteRecord[] = TRoutes> =
  Routes extends readonly (infer R)[]
    ? R extends { name: Name, path: infer Path }
      ? ExtractRouteParams<Path & string>
      : R extends { [CHILDREN_ROUTE]: readonly AppRouteRecord[] }
        ? RouteParamsForName<Name, R[typeof CHILDREN_ROUTE]>
        : never
    : never

type OptionalIfAllParamsOptional<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T] extends never
  ? { params?: T }
  : { params: T }

export type TRouteTo<Name extends TRouteNames = TRouteNames> = {
  name: Name
} & OptionalIfAllParamsOptional<RouteParamsForName<Name>>

const router = createRouter({
  routes: routes as unknown as RouteRecordRaw[],
  history: createWebHistory('/'),
})

export const getRoute = <Name extends TRouteNames>(to: TRouteTo<Name>) => {
  return to
}

export default router
