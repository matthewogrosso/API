const { store, setUser, setRoom, setIsLoggedIn } = require('./store')
console.log(store)
setUser('none')
setRoom('general')
setIsLoggedIn('true')

console.log(store)