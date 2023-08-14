//we can generate the secret key for jwt using nodejs' built in crypto module
const crypto = require('crypto')

const key1 = crypto.randomBytes(32).toString('hex')
const key2 = crypto.randomBytes(32).toString('hex')

console.table({key1, key2})

//this file should not be executed unless you suspect security breach in your app. 
//it will generate a new pair of refresh and acces tokens which you can then set as environment variables.