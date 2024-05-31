# Vue Router Types Demo

This project demonstrates the use of type safety in the Vue Router file. It showcases how you can create a type-safe `validateRouteByNameWithParams` function that accepts an object with the route name and required parameters.

## Check file - src/router-required-params.ts

## Vue Router Types

In the `router*.ts` file, a new type `AppRouteRecord` is defined, which extends the standard `RouteRecordRaw` type from Vue Router. This new type adds a required `name` property and the ability to specify child routes of type `AppRouteRecord`.

Then, helper types `GetRouteName` and `GetRoutesNames` are defined, which extract all route names from the routes array.

The routes array is declared using `as const`, allowing TypeScript to infer the most precise type for each element in the array.

## Route Parameter Extraction

The project also provides a way to extract parameters from the route path using the helper type `ExtractRouteParams`. This type analyzes the path string and creates an object containing the parameter names as keys and their types as `string`.

Then, the `RouteParamsForName` type is defined, which takes a route name and an array of routes `TRoutes` and returns an object with the parameters for the given route name.

## validateRouteByNameWithParams Function

The `validateRouteByNameWithParams` function accepts an object containing the route name and required parameters. Thanks to the types, TypeScript ensures that the correct parameters are passed for each route name.

---

## Compilation SUCCESS 

### with required param
validateRouteByNameWithParams({ name: 'catalog.item', params: { id: '1' } })

### without non-require param
validateRouteByNameWithParams({ name: 'catalog.item', params: { id: '1' } })

### with non-require param
validateRouteByNameWithParams({ name: 'home', 'prefix_city': 'new-york' })

### without param
validateRouteByNameWithParams({ name: 'home' })

---

## Compilation ERROR 

### non-exist option
validateRouteByNameWithParams({ path: '/home' })

### non-exist name
validateRouteByNameWithParams({ name: 'product' })

### the require parameter should be 'id', not 'idx'
validateRouteByNameWithParams({ name: 'catalog.item', params: { idx: 'value' } })

### the non-require parameter should be 'prefix_city', not 'prefix_ci'
validateRouteByNameWithParams({ name: 'home', params: { prefix_ci: 'new-york' } })

### the parameter should be required 'id'
validateRouteByNameWithParams({ name: 'catalog.item.reviews' })