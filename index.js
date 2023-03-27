const express = require('express');
const multer = require('multer')
const tesseract = require('tesseract.js');
const path = require('path')
const app = express()
const cors = require('cors')
 
app.use(cors())
app.set('view engine', "ejs")
app.use(express.static(path.join(__dirname + '/uploads')))
 
 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
 
const upload = multer({storage:storage})
 
app.post('/extracttextfromimage', upload.single('file'), (req, res) => {
 
    tesseract
      .recognize(req.file.path, 'eng')
      .then(({ data: { text } }) => {
        let doc = {}
        if(text.includes('Government of India')){
            const lines = text.split('\n').map(line => line.trim())
            doc = {
              idType: "aadhaarCard",
              idNumber: lines[7],
              name: lines[3].split(' ')[1].trim() + ' ' + lines[3].split(' ')[2].trim(),
              DOB: lines[4].split(' ')[3].trim(),
              gender: lines[5].split(' ')[2].trim()
            }
          }
          else if(text.includes('INCOME')){
            const lines = text.split('\n').map(line => line.trim())
            doc = {
              idType: "panCard",
              idNumber: lines[3].split(' ')[1].trim(),
              name: lines[6].split(' ')[0].trim() + " " + lines[6].split(' ')[1].trim(),
              father: lines[8].split(' ')[0].trim() + " " + lines[8].split(' ')[1].trim(),
              DOB: lines[10].split(' ')[2].trim()
            }
          }
          else if(text.includes('ELECTION')){
            const lines = text.split('\n').map(line => line.trim())
            doc = {
              idType: "voterIdCard",
              idNumber: lines[6].split(' ')[0].trim(),
              name: lines[8].split(':')[1].trim(),
              father: lines[10].split(':')[1].trim(),
              gender: lines[11].split(' ')[4].trim(),
              DOB: lines[12].split(' ')[4].trim()
            }
          }
          console.log(doc.idType);
          res.send(doc).status(200)
      })
      .catch((error) => {
        console.log(error.message);
      })
})
 
 
app.listen(5000, () => {
    console.log("App os listening on port 5000")
})