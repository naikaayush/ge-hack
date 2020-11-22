const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const FileReader = require("filereader");
const CryptoJS = require("crypto-js");
const { Transform } = require('stream');

class AppendInitVect extends Transform {
  constructor(initVect, opts) {
    super(opts);
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
}
module.exports = AppendInitVect;

function getCipherKey(password) {
    return crypto.createHash('sha256').update(password).digest();
  }

function hashFile(file){
    const readStream = fs.createReadStream(file);
    var wordArray = CryptoJS.lib.WordArray.create(readStream);
    var hash = CryptoJS.SHA256(wordArray);
    var hashed = hash.toString();
    console.log(hashed);
    return hashed
}
// hashFile('./PES1201800326_Week_10-11_OS_Lab.pdf');

function encrypt( {file, password} ) {
    // Generate a secure, pseudo random initialization vector.
    const initVect = crypto.randomBytes(16);
    
    // Generate a cipher key from the password.
    const CIPHER_KEY = getCipherKey(password);
    const readStream = fs.createReadStream(file);
    const gzip = zlib.createGzip();
    const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
    const appendInitVect = new AppendInitVect(initVect);
    // Create a write stream with a different file extension.
    const writeStream = fs.createWriteStream(path.join(file + ".enc"));
    
    readStream
      .pipe(gzip)
      .pipe(cipher)
      .pipe(appendInitVect)
      .pipe(writeStream);
  }

// encrypt({ file: './PES1201800326_Week_10-11_OS_Lab.pdf', password: 'userId' });

function decrypt({ file, password }) {
    // First, get the initialization vector from the file.
    const readInitVect = fs.createReadStream(file, { end: 15 });
  
    let initVect;
    readInitVect.on('data', (chunk) => {
      initVect = chunk;
    });
    // Once we’ve got the initialization vector, we can decrypt the file.
    readInitVect.on('close', () => {
      const cipherKey = getCipherKey(password);
      const readStream = fs.createReadStream(file, { start: 16 });
      const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
      const unzip = zlib.createUnzip();
      const writeStream = fs.createWriteStream(file + '.unenc');
  
      readStream
        .pipe(decipher)
        .pipe(unzip)
        .pipe(writeStream);
    });
  }
// ------------------------------------------------------------------------------------------
// BELOW CODE NOT TESTED NO IDEA WHAT IS HAPPENING BRRRR

  // -----------------------------------------------------------------------
const FILE_NAME = './PES1201800326_Week_10-11_OS_Lab.pdf'
const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const Date = require("date")
const mongoose = require("mongoose");
const app = express();
const Post = require("./models/post");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.post("/api/post", (req, res, next) => {
    // post hash of file with time stamp
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: hashFile(FILE_NAME),
    time: Date.now(),

  });
  post.save().then((createdPost) => {
    console.log(createdPost);
    res.status(201).json({
      message: "Post Added",
      postId: createdPost._id,
    });
  });
  console.log(post);
});

app.get("/api/posts", (req, res, next) => {
  // const posts = [
  //   { id: "001", title: "Server Post1", content: "Lorem Ipsum" },
  //   { id: "002", title: "Server Post2", content: "Lorem Dolor" },
  // ];
  Post.find().then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

https
  .createServer(
    {
      key: fs.readFileSync("certificates/server.key"),
      cert: fs.readFileSync("certificates/server.cert"),
    },
    app
  )
  .listen(443, () => {
    console.log("Listening at :443...");
  });