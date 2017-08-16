const fs = require('fs')

fs.readFile('./animal.txt', 'utf-8', (err, data) => {
  if (err) {
   console.log(err)
  }
  console.log(data)
})
