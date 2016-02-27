export function buildRoutes (actions, routeducers) {
  Object.keys(actions)
    .reduce((routes, key) => {
      const action = key.toLowerCase().replace(/_(\w)/g, (m, p) => p.toUpperCase())
      const handler = routeducers[action]
      const actionType = actions[key]

      if (typeof handler !== 'function') {
        return routes
      }

      return { ...routes, [actionType]: handler }
    }, {})
}

export function slug (name) {
  return name.toLowerCase()
}
