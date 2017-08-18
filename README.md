# Github-Grabber

This project will provide an introduction to Node through several of its popular modules. 
We'll use Node's [fs], [process], and [http], as well as the third-party [nodemon] to build an application that fetches a user's starred repos and writes them to a file.

[path]: https://nodejs.org/api/path.html#path_path
[fs]: https://nodejs.org/api/fs.html#fs_file_system
[http]: https://nodejs.org/api/http.html#http_http
[nodemon]: https://nodemon.io/
[process]: https://nodejs.org/api/process.html#process_process

### :bug: :no_entry_sign: Debugging

Chrome's inspector is available to us when debugging Node applications. [Read about it here][debugging]!

[debugging]: https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27

## Reading and Writing from Files

We'll start with the [fs] module. There is a provided animals.txt file we'll use to conduct our experiments. Make an empty file for our Node code:

`touch animal_fun.js`

The `fs` module is provided with Node, but we'll need to `require` the module in our file. To start, we'll read the animal file and console.log every entry.

```javascript
const fs = require('fs')

fs.readFile('./animals.txt', (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(data)
})
```

`fs.readFile` is an asynchronous function. We provide the path to the file (first argument) and a callback to be invoked when the file is read. This callback is provided an error object (if it exists) and the data from the file.

**N.B. The order of arguments in these callbacks is very common in Node!**

Run the file with `node animal_fun.js`. Yipes, that doesn't look like a string at all! We're looking at a raw [Buffer] object. 

Neat, but since we know this will be a text file and we'd like to make it human-readable, let's provide an additional argument to `readFile` that specifies the encoding...

[Buffer]: https://nodejs.org/api/buffer.html
[error]: https://nodejs.org/api/errors.html#errors_errors

```javascript
const fs = require('fs')

fs.readFile('./animals.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(data)
})
```

Now we can run the file and see a nice list of all our animals. As an experiment, provide a non-existent file as the first argument and check out that [error] object.

Let's move on to [fs.writeFile]. There are a few differences: we provide the data that should be written to the file as the second argument, and our callback function will now only be provided the error object (if it exists).

```javascript
const fs = require('fs')

fs.writeFile('./example.txt', 'I will be written to example.txt', err => {
  if (err) {
    console.log(err)
    return
  }
  console.log("file successfully written!")
})
```

Run this code and you'll see the new file `example.txt` written in the same directory as our `animal_fun.js` file. If a file already exists as the first argument, it will be overwritten so be careful.

### Passing arguments from the command line

Eventually we'll be parsing input from HTTP requests, but to start let's explore how to pass information into our script from the command line. Node provides a global [process] object which will allow us to pass arbitrary arguments from our terminal.

To start, let's `console.log` the process object and see what we're dealing with:

```javascript
// we don't even need to require 'process'!

console.log(process)
```

Wow, that's a lot of stuff! `process` contains loads of information, so we'll narrow it down by accessing the `argv` key. `console.log(process.argv)`. We should see an array with two arguments: the absolute paths of the Node executable and the file. 

Try adding some additional words after `node animal_fun.js` and see how it comes through. For example `node animal_fun.js argv_index_2 argv_index_3 potato`. We'll have access to those additional arguments in our script by bracketing into the process.argv array starting at `process.argv[2]`.

### Putting it all together so far...

Let's put everything we've learned so far to use:

* Pass a single letter to your script
* Read the animals.txt file
* Grab every animal which begins with the letter
* Write that list of animals to a new file called "{letter}_animals.txt"

You can do it!

## Introducing HTTP

We'll now turn our attention to the [http] module, using the [createServer] method to
create an instance of [http.Server]. 

### Nodemon 

Before we dive into server-world. We're going to `npm install --save-dev nodemon`.

Nodemon will kill and restart your server whenever you make changes to the file. If we didn't use nodemon, we'd have to manually kill and restart the server to see the effect of our changes, which would be a hassle. Thanks Nodemon!

### package.json scripts

Go into your package.json and add a key under the `scripts` object of `start` pointing to the string "nodemon animal_fun.js" (the file housing our server code). This will allow us to run `npm start` and run our server using nodemon as a developer [dependency].

[dependency]: https://www.linkedin.com/pulse/npm-dependencies-vs-devdependencies-daniel-tonon

### Our first server


As an argument, provide a callback that is invoked with [request] and [response] objects as arguments. For now, use [response.write] to send a message of "Hello world". With this bare-bones server, we need to invoke [response.end] to signal we're done forming our response.

Finally, we need to provide a port to our server. Use http.Server's [listen] method and provide an unoccupied port of your choice as the first argument and a callback confirming we're listening on a certain port. A simple `console.log` will suffice!

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
    res.write('hello world')
    res.end()
})

server.listen(8000, () => console.log("I'm listening on port 8000!"))

```

[request]: https://nodejs.org/api/http.html#http_class_http_clientrequest
[response]: https://nodejs.org/api/http.html#http_class_http_serverresponse

### Putting it all together, part 2

Now that we have a basic HTTP server, let's redo our previous task using the HTTP request/response cycle. You may find the [querystring] module helpful. 

Let's handle two situations:

* No letter is passed to our server and we return the entire animals.txt file 
or 
* A letter is passed to our server and we filter the animals starting wtih that letter.

To recap:

* Check if the client passed a letter to your Node server as a query string
* Read the animals.txt file into memory
* If a letter was passed, select all animals that start with the provided letter
* Write the result in your response (Don't worry about valid HTML for now)

Once you have that working, let's refactor a bit. As it stands, we're reading a file with every request but our server is running continuously. It would be better if we stored the contents of the file in memory and eliminated those unnecessary file reads.

Try storing the file contents in a cache (a POJO will work just fine), and check with each request to see if we have the data already. We can expand this idea to store query results as well...

## API calls from our server

Our goal is to write a Node server which will receive a `POST` request of a Github username. Our server will make a request to the Github API with this information and retrieve all the repos this user has starred. Finally, the list of starred repos will be written to a file.

Let's start with a clean slate: `touch github_grabber.js`.

We'll need the [fs], [querystring], [https], and [http] modules as well, require them at the top of the file. Start by creating a simple server using what you've learned so far. We only care about `POST` requests right now, so let's check for that in the request object.

[https]: https://nodejs.org/api/https.html

```javascript
const githubServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    res.end("I'm a POST request!")
  }
  res.end("Danger, not a POST request!")
})

githubServer.listen(8080, () => console.log('Listening on 8080'))
```

Let's take a quick detour and learn more about the [request] object fed into our callback as the first argument. This object is an implementation of the [writable] stream and inherits from the event [emitter] class. 

Streams are a big topic in Node, and I'd encourage you to read more about them, but for our purposes we can think of them as collections of data _eventually_. In other words, we don't have this data all at once and we're not sure when all the data will be available. There are benefits to this, but it means we'll need to listen for certain events to be sure we're getting everything we need. 

Inside our conditional for `POST` requests, declare a variable that will accumulate our data. It should start as an empty string. Add event listeners for `data` and `end` events to our request. In the callback for `data` we should add that data to our variable. In the callback for `end`, we can do whatever we need with confidence that all the data has been retrieved.

### :warning: Protect your server :warning:

Streams are great and powerful, but imagine a malicious user posting MASSIVE amounts of data to your Node server. You'd keep reading in data until your server blew. We're not checking the body length below, but [beware]!

[beware]: https://stackoverflow.com/a/8640308

```javascript
const githubServer = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = ''
    req.on('data', d => {
      // d is an instance of Buffer, 
      // toString is implicitly called when we add it to body
      body += d
    })
    req.on('end', () => {
      // qs.parse will give us a nice object to retrieve the value
      const username = qs.parse(body).username
      res.end(username)
    })
  }
})
```

Okay! We've written a decent amount of code, so let's test that it works. I used [curl] to post a username to my server, but you could use POSTMAN or other tools... Check to make sure your server is printing out the username you're POSTing.

Once you have successfully parsed the username, it's time to make our call to Github's API. We'll use the [https] module to make our request because Github requires that protocol. `https.get` takes an options object to configure the [request], check it out! 

Github has a friendly REST [API], look up the appropriate URL for your request. The API requires a [user-agent] header be set, make sure that's included in your [request] configuration object.

### Last Steps...

* Make a request to the Github API to retrieve the user's starred repos
* In the request callback:
  * Listen for `data` and `end` events and handle appropriately
  * Select the fields you want to write, I picked 'name' and 'stargazers_count'
  * Write to a file either using `createWriteStream` or `writeFile`
  * End the original `http.Response` object with the contents of the file

You did it!

:tada: :tada: :tada:

[request]: https://nodejs.org/api/http.html#http_http_request_options_callback

[user-agent]: https://developer.github.com/v3/#user-agent-required

[API]: https://developer.github.com/v3/#schema

[curl]: https://superuser.com/questions/149329/what-is-the-curl-command-line-syntax-to-do-a-post-request

[writable]: https://nodejs.org/api/stream.html#stream_class_stream_writable
[emitter]: https://nodejs.org/api/events.html#events_class_eventemitter

[querystring]: https://nodejs.org/api/querystring.html

[response.write]: https://nodejs.org/api/http.html#http_response_write_chunk_encoding_callback

[http.Server]: https://nodejs.org/api/http.html#http_class_http_server

[createServer]: https://nodejs.org/api/http.html#http_http_createserver_requestlistener
[fs.writeFile]: https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback

[listen]: https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
[response.end]: https://nodejs.org/api/http.html#http_response_end_data_encoding_callback
