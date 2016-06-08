const idle = require('./idle.js')

setInterval(()=> 
    console.log('ping', idle.getIdleTimeInMs() + new Date())
, 5 * 1000)