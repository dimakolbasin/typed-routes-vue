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
    component: () => import('~/components/RouteName.vue')
  },
  {
    name: 'catalog.list',
    path: '/catalog',
    component: () => import('~/components/RouteName.vue')
  },
  {
    name: 'catalog.item',
    path: '/catalog/:id',
    component: () => import('~/components/RouteName.vue'),
    children: [
      {
        name: 'catalog.item.reviews',
        path: '/catalog/:id/reviews',
        component: () => import('~/components/RouteName.vue')
      }
    ]
  }
] as const satisfies readonly AppRouteRecord[]

type TRoutes = typeof routes
type TRouteNames = GetRoutesNames<TRoutes>

// Вспомогательный тип для извлечения параметров из строки пути
type ExtractRouteParams<Path extends string> =
  Path extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<Rest>]: string | number }
    : Path extends `${infer _Start}:${infer Param}`
      ? { [K in Param]: string | number }
      : {}

type RouteParamsForName<Name extends TRouteNames, Routes extends readonly AppRouteRecord[] = TRoutes> =
  Routes extends readonly (infer R)[]
    ? R extends { name: Name, path: infer Path }
      ? ExtractRouteParams<Path & string>
      : R extends { children: readonly AppRouteRecord[] }
        ? RouteParamsForName<Name, R['children']>
        : never
    : never

export type TRouteTo<Name extends TRouteNames = TRouteNames> = {
  name: Name,
  params?: RouteParamsForName<Name>
}

const router = createRouter({
  routes: routes as unknown as RouteRecordRaw[],
  history: createWebHistory('/')
})

const getLink = <Name extends TRouteNames>(to: TRouteTo<Name>) => {
  return to
}

// Пример использования
getLink({ name: 'catalog.item', params: { id: 'value' } })
// Ошибка компиляции, так как параметр должен быть 'id', а не 'idx'
// getLink({ name: 'catalog.item', params: { idx: 'value' } })

getLink({name: 'catalog.item.reviews', params: {id: '1'}})
getLink({name: 'catalog.item.reviews', params: {id: 1}})

export default router
