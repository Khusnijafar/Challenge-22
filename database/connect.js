const MongoClient = require('mongodb').MongoClient;
var Object = require('mongodb').Object;
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'crud';

module.exports = function(cb){
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if(err) return console.log("koneksi gagal");
    const db = client.db(dbName);
    cb(db);
  });
}