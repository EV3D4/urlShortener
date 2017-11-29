var express = require('express');
var app = express();
var urlExists = require('url-exists');
var validUrl = require('valid-url');
var request = require('request');

var home="https://urlshortener-kalpitp.herokuapp.com/"

const MongoClient = require('mongodb').MongoClient


// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

MongoClient.connect("mongodb://<name>:<pw>@ds123896.mlab.com:23896/heroku_p5r3tw5z", (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port, () => {


  })
})


app.get(['/', '/about'], function(req, res) {
  // ejs render automatically looks in the views folder
  res.render('index.ejs')
});


app.get('/:Qpath', (req, res) => {
  db.collection('shortURL').find({
    "short_url": home + req.params.Qpath
  }).toArray((err, result) => {
    if (err) return console.log(err)
    else if (result.length == 0)
      res.write("Invalid Request")
    else
      res.writeHead(302, {
        'Location': "https://" + result[0].original_url
      });
    res.end();
  })
})



app.get('/new/https://:Qpath', (req, res) => {
var dbObj
var link = new Date()

hexString = (link.getYear() + link.getMonth() + link.getSeconds()).toString(16);
var urlType = 'https://' + req.params.Qpath



request(urlType, function(error, response, body) {
  if (!error && response.statusCode == 200) {

    dbObj = {
      original_url: req.params.Qpath,
      short_url: home + hexString
    }

    db.collection('shortURL').save(dbObj, (err, result) => {
      if (err) return console.log(err)
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(dbObj));
    })

  } else {
    dbObj = "URL Does Not Exsist"
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(dbObj));
  }

})

})
