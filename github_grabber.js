const fs = require('fs')
const qs = require('qs')
const http = require('http')
const request = require('request')

// const options = {
//   url: 'https://api.github.com/users/pklong',
//   headers: {
//     'User-Agent': 'github-grabber'
//   }
// }
// request(options).pipe(fs.createWriteStream('./repos.txt'))

const githubServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = ''
    req.on('data', d => {
      body += d
    })
    req.on('end', () => {
      const username = qs.parse(body).username
      res.end(username)
    })
  }
})

githubServer.listen(8080, () => console.log('Listening on 8080'))
