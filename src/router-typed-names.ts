import type { RouteParams, RouteRecordRaw } from 'vue-router'
import {createRouter, createWebHistory} from 'vue-router'

type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & {
    name: string
    children?: readonly AppRouteRecord[]
}

type GetRouteName<T extends AppRouteRecord> =
  T extends {children: readonly AppRouteRecord[]}
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

export type TRouteTo = {
  name: TRouteNames,
  params?: RouteParams
}

const routerTypedNames = createRouter({
  routes: routes as unknown as RouteRecordRaw[],
  history: createWebHistory('/')
})

const getLink = (to: TRouteTo) => {
  return to
}

getLink({name: 'catalog.list'})


export default routerTypedNames
