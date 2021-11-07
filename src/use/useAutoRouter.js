export default function userAutoRouter() {
  const modules = import.meta.globEager('../views/**/*.vue')

  const routeModuleList = []

  Object.keys(modules).forEach((key) => {
    const name = key.split('/').slice(-1)[0].split('.')[0]
    const mod = modules[key].default || {}
    // const modList = Array.isArray(mod) ? [...mod] : [mod]
    routeModuleList.push({
      path: '/' + name,
      name,
      component: mod
    })
  })
  return routeModuleList
}
