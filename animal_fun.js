const fs = require('fs')
const http = require('http')

// fs.readFile('./animals.txt', 'utf-8', (err, data) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log(data)
// })

// fs.writeFile('./example.txt', 'I will be written to example.txt', err => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log('file successfully written')
// })

// const animalLetter = process.argv[2].toUpperCase()

// fs.readFile('./animals.txt', 'utf-8', (err, data) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   const animals =
//         data
//         .split('\n')
//         .filter(animal => animal.startsWith(animalLetter))
//         .join('\n')

//   fs.writeFile(`${animalLetter}_animals.txt`, animals, err => {
//     if (err) {
//       console.log(err)
//       return
//     }
//     console.log(`successfully created ${animalLetter}_animals.txt`)
//   })
// })

const server = http.createServer((req, res) => {
  res.write('hello world')
  res.end()
})

server.listen(8000, () => console.log("I'm listening on port 8000"))
