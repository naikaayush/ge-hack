const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const FileReader = require("filereader");
const CryptoJS = require("crypto-js")
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