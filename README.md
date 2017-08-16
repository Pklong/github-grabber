# Github-Grabber

This project will provide an introduction to Node through several of its popular modules. 
We'll use Node's [path], [fs], [process], [http], as well as the third-party [request] to build an application that fetches a user's repos and writes them to a file.

[path]: https://nodejs.org/api/path.html#path_path
[fs]: https://nodejs.org/api/fs.html#fs_file_system
[http]: https://nodejs.org/api/http.html#http_http
[request]: https://github.com/request/request
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

## Passing arguments from the command line

Eventually we'll be parsing input from HTTP requests, but to start let's explore how to pass information into our script from the command line. Node provides a global [process] object which will allow us to pass arbitrary arguments from our terminal.

To start, let's `console.log` the process object and see what we're dealing with:

```javascript
// we don't even need to require 'process'!

console.log(process)
```

Wow, that's a lot of stuff! `process` contains loads of information, so we'll narrow it down by accessing the `argv` key. `console.log(process.argv)`. We should see an array with two arguments: the absolute paths of the Node executable and the file. 

Try adding some additional words after `node animal_fun.js` and see how it comes through. For example `node animal_fun.js argv_index_2 argv_index_3 potato`. We'll have access to those additional arguments in our script by bracketing into the process.argv array starting at `process.argv[2]`.

## Putting it all together so far...

Let's put everything we've learned so far to use:

* Pass a single letter to your script
* Read the animals.txt file
* Grab every animal which begins with the letter
* Write that list of animals to a new file called "{letter}_animals.txt"

You can do it!







[fs.writeFile]: https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
