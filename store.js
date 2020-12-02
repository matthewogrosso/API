const store = {
    user: "",
    room: "",
    isLoggedIn: ""
}

function setUser (user) {
    store.user = user
}

function setRoom (room) {
    store.room = room
}

function setIsLoggedIn (isLoggedIn) {
    store.isLoggedIn = isLoggedIn
}

exports.store = store
exports.setUser = setUser
exports.setRoom = setRoom
exports.setIsLoggedIn = setIsLoggedIn