const handleErrors = (response) =>
  response.json().then(json => {
    if (!response.ok) {
      throw Error(json.message || 'API Error')
    }

    return response.ok ? json : Promise.reject(json)
  })

const isValid = (value) => !([null, undefined, Infinity, NaN]).includes(value)

const optionallyEncode = (value, name = '') => {
  const encodableFields = ['sector', 'universe', 'industry']

  return encodableFields.includes(name) ? encodeURIComponent(value) : value
}

const paramify = (obj = {}, options = {}) =>
  Object
    .keys(obj)
    .filter(key => !([null, undefined]).includes(obj[key]))
    .map(key => `${key}=${optionallyEncode(obj[key], key)}`)
    .join('&')

const cleanObject = (obj = {}) => {
  let transformed = {}

  Object.keys(obj).forEach(key => {
    let value = obj[key]

    if (isValid(value)) {
      transformed[key] = value
    }
  })

  return transformed
}

function ApiStore(options) {
  this.localStorageKey = 'Lazard:ApiStore'
  this.cache = new Map()
  this.output = true

  Object.assign(this, options)

  return this
}

ApiStore.prototype.findCached = function(key) {
  return this.cache.get(key)
}

ApiStore.prototype.saveToCache = function(key, promise, options = {}) {
  this.cache.set(key, Object.assign({
    date: new Date,
    promise
  }, options))

  return promise
}

ApiStore.prototype.get = function(path, options = {}) {
  let instance = this
  let q = options.q || options.query || {}
  let origin = q.from

  delete q.from
  delete q.sql

  q = cleanObject(q)

  delete options.query
  delete options.q

  options = cleanObject(options)

  // add root api path if shorthand paths are given (e.g. "cfd")
  if (path.indexOf('/') !== 0) {
    path = `/api/${path}`
  }

  console.groupCollapsed('APISTORE:', path, origin)

  if (Object.keys(q).length) {
    console.log('query', q)
  }

  if (Object.keys(options).length) {
    console.log('options', options)
  }

  // add query string params
  if (!path.includes('?')) {
    path = path + '?' + paramify(q, options)
  }

  // delete options.q
  // delete options.query

  // console.time('ApiStore:fromCache ' + path)
  // console.time('ApiStore:fromAPI ' + path)

  // RETURN CACHED VERSION IF CACHED
  let cached = this.findCached(path)
  if (cached) {
    console.info('retrieving cached data', cached)
    console.groupEnd()
    return cached.promise
  }

  // ONLY ATTEMPT TO FETCH PERSISTED IF ASKED TO PERSIST
  if (options.persist) {
    let stored = this.getPersisted(path)
    if (stored) {
      console.info('retrieving stored data')
      console.groupEnd()
      return Promise.resolve(stored)
    }
  }

  // console.timeEnd('ApiStore:fromCache ' + path)

  // FETCH AS FINAL PASS
  console.info('fetching', path)
  console.groupEnd()

  let fetchPromise = fetch(path, {
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  })
  .then(handleErrors)
  .then(results => {
    console.log('returning results for', origin)

    if (options.first) {
      results = results.shift()
    }

    if (options.persist) {
      instance.persist(path, results)
    }

    return results
  })
  .catch(err => {
    console.warn('API ERROR', err.message)
    instance.clear(path)
  })

  return this.saveToCache(path, fetchPromise, options)
}

// ApiStore.prototype.async = function(path) {
//   let self = this

//   return function(callback) {
//     return self
//       .get(path)
//       .catch(err => {
//         console.warn('API ERROR', err.message)
//       })
//       .then(data => callback(null, data))
//   }
// }

ApiStore.prototype.auth = function(user, callback) {
  return fetch('/auth', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    credentials: 'include',
    body: Object.keys(user).map(attr => `${attr}=${encodeURIComponent(user[attr])}`).join('&')
  })
  .then(handleErrors)
  .catch(err =>({ error: Error(err.message)}))
}

ApiStore.prototype.logout = function(callback) {
  var url = '/auth/logout'

  let fetchPromise = fetch('/auth/logout', {
    method: 'post',
    credentials: 'include'
  })
  .then(handleErrors)

  if (callback) {
    fetchPromise.then(data => callback(data ? null : true, data))
  }

  return fetchPromise
}

ApiStore.prototype.clear = function(path) {
  if (!path) {
    this.cache.clear()
  } else {
    this.cache.delete(path)
  }

  return this//.persist()
}

ApiStore.prototype.clearPersisted = function() {
  localStorage && localStorage.clear()

  return this
}

ApiStore.prototype.getPersisted = function(key) {
  var stored = localStorage && localStorage.getItem(key)

  if (stored) {
    // console.log('getting persisted value', stored)
    return JSON.parse(stored)
  }

  return undefined
}

ApiStore.prototype.persist = function(key, value) {
  if (value) {
    // console.info('persisting', JSON.stringify(value))
    localStorage.setItem(key, JSON.stringify(value))
    return true
  }

  return false
}

export default new ApiStore()
