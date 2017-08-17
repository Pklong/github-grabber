# Github-Grabber

This project will provide an introduction to Node through several of its popular modules. 
We'll use Node's [path], [fs], [process], [http], as well as the third-party [request] and [nodemon] to build an application that fetches a user's repos and writes them to a file.

[path]: https://nodejs.org/api/path.html#path_path
[fs]: https://nodejs.org/api/fs.html#fs_file_system
[http]: https://nodejs.org/api/http.html#http_http
[request]: https://github.com/request/request
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



[querystring]: https://nodejs.org/api/querystring.html

[response.write]: https://nodejs.org/api/http.html#http_response_write_chunk_encoding_callback

[http.Server]: https://nodejs.org/api/http.html#http_class_http_server

[createServer]: https://nodejs.org/api/http.html#http_http_createserver_requestlistener
[fs.writeFile]: https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback

[listen]: https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
[response.end]: https://nodejs.org/api/http.html#http_response_end_data_encoding_callback
