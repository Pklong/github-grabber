const fs = require('fs')
const qs = require('qs')
const http = require('http')
const https = require('https')

function buildOptionsObj (username) {
  return {
    hostname: `api.github.com`,
    path: `/users/${username}/starred`,
    headers: {
      'User-Agent': 'github-grabber'
    }
  }
}

const githubServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let requestBody = ''
    req.on('data', chunk => {
      requestBody += chunk
    })
    req.on('end', () => {
      const username = qs.parse(requestBody).username
      const ws = fs.createWriteStream(`./${username}_starred_repos.txt`)
      const opts = buildOptionsObj(username)
      https.get(opts, (dataStream) => {
        let repoData = ''
        dataStream.on('data', chunk => { repoData += chunk })
        dataStream.on('end', () => {
          const repos = JSON.parse(repoData).map(repo => {
            return `Repo: ${repo.name}. Stars: ${repo.stargazers_count}.`
          }).join('\n')
          ws.write(repos)
          res.end(repos)
        })
      })
    })
  }
})

githubServer.listen(8080, () => console.log('Listening on 8080'))
