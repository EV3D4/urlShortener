const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
var urlExists = require('url-exists');
var url = require('url');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))

var db
var dbObj
var i=0;
var k;

MongoClient.connect("mongodb://freecodecamp:urlShortener@ds119306.mlab.com:19306/freecodecamp", (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')

  })
})


app.get('/', (req, res) => {
  db.collection('shortURL').find().toArray((err, result) => {
    if (err) return console.log(err)

    res.render('index.ejs', {
        shortURL: result
    })
  })
})


app.get('/:Qpath', (req, res) => {


db.collection('shortURL').find({"shortURL": "localhost:3000/"+req.params.Qpath}).toArray((err, result) => {
    if (err) return console.log(err)

        res.writeHead(302, {'Location': "https://"+result[0].url});
        res.end();

  })

})




app.get('/new/https://:Qpath', (req, res) => {

  db.collection('shortURL').find().toArray((err, result) => {
      if (err) return console.log(err)

      dbObj= {url:req.params.Qpath, shortURL: "localhost:3000/" + result.length}


      db.collection('shortURL').save(dbObj, (err, result) => {
        if (err) return console.log(err)

        res.redirect('/')

      })
})


})
