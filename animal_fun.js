const fs = require('fs')
const http = require('http')
const qs = require('querystring')
const cache = {}

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

// function selectAnimals(animalString, animalLetter) {
//   return animalString
//     .split('\n')
//     .filter(animal => animal.startsWith(animalLetter))
//     .join('\n')
// }

// const animalLetter = process.argv[2].toUpperCase()

// fs.readFile('./animals.txt', 'utf-8', (err, data) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   const animals = selectAnimals(data, animalLetter)

//   fs.writeFile(`${animalLetter}_animals.txt`, animals, err => {
//     if (err) {
//       console.log(err)
//       return
//     }
//     console.log(`successfully created ${animalLetter}_animals.txt`)
//   })
// })

// const animalServer = http.createServer((req, res) => {
//   const query = req.url.split('?')[1]
//   if (query !== undefined) {
//     const animalLetter = qs.parse(query).letter.toUpperCase()

//     if (cache[animalLetter] !== undefined) {
//       res.end(cache[animalLetter])
//     }

//     if (animalLetter !== undefined) {
//       fs.readFile('./animals.txt', 'utf-8', (err, data) => {
//         if (err) {
//           console.log(err)
//           res.end('IT WENT POORLY')
//           return
//         }
//         const animals = selectAnimals(data, animalLetter)
//         cache[animalLetter] = animals
//         res.end(animals)
//       })
//     }
//   } else {
//     if (cache['animals'] !== undefined) {
//       res.end(cache['animals'])
//     }
//     fs.readFile('./animals.txt', 'utf-8', (err, data) => {
//       if (err) {
//         console.log(err)
//         res.end('IT WENT POORLY')
//         return
//       }
//       cache['animals'] = data
//       res.end(data)
//     })
//   }
// })

// animalServer.listen(8000, () => console.log("I'm listening on port 8000"))
