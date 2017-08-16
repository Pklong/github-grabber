# Github-Grabber

This project will provide an introduction to Node through several of its popular modules. 
We'll use Node's [path], [fs], [http], as well as the third-party [request] to build an application that fetches a user's repos and writes them to a file.

[path]: https://nodejs.org/api/path.html#path_path
[fs]: https://nodejs.org/api/fs.html#fs_file_system
[http]: https://nodejs.org/api/http.html#http_http
[request]: https://github.com/request/request

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

`fs.readFile` is an asynchronous function. We provide the path to the file (first argument) and a callback to be invoked when the file is read. This callback is provided an error object and the data from the file.

**N.B. The order of arguments in these callbacks is very common in Node!**

Run the file with `node animal_fun.js`. Yipes, that doesn't look like a string at all! We're looking at a raw [Buffer] object. 

Neat, but since we know this will be a text file and we'd like to make it human-readable, let's provide an additional argument to `readFile` that specifies the encoding...

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

[Buffer]: https://nodejs.org/api/buffer.html
[error]: https://nodejs.org/api/errors.html#errors_errors
