export default {
  getParent(instance, Ctor) {
    while (instance = instance.$parent) {
      if (instance instanceof Ctor) {
        return instance
      }
    }

    return null
  },

  getPropByPath (obj, path) {
    const key = '([\\w\\$]+)'
    const origPath = path
    const origObj = obj

    var lastPath
    var lastObj

    lastPath = path
    lastObj = obj

    path = path.replace(new RegExp('^' + key), (_, match) => {
      try {
        obj = obj[match]
      } catch (e) {
        console.error(`Cannot get value by ${origPath} in `, JSON.stringify(origObj))
        obj = ''
      }
      return ''
    })

    while (path) {
      let found = false
      lastPath = path
      lastObj = obj
      path = path.replace(new RegExp('^\\.' + key + '|^\\[' + key + '\\]'), (_, value1, value2) => {
        const value = value1 || value2
        try {
          obj = obj[value]
          found = true

        } catch (e) {
          console.error(`Cannot get value by ${origPath} in `, JSON.stringify(origObj))
          obj = ''
        }
        return ''
      })

      if (!found) {
        if (path) {
          console.error(`Cannot match path ${path} in `, JSON.stringify(origObj))
        }
        break
      }
    }

    return {
      get () {
        return obj
      },
      set (value) {
        lastObj[lastPath] = value
      }
    }
  }
}
