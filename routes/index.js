var express = require("express");
var router = express.Router();
var mongodb = require("mongodb");

module.exports = function (db) {
  const Todo = db.collection("data");
  /* GET home page. */
  //   router.get('/', function (req, res) {
  //     Todo.find().toArray((err, docs) => {
  //       if (err) throw err;
  //       res.render('index', {
  //         data: docs
  //       });
  //     });
  //   });
  // // berkunjung ke router http://localhost:3000/
  router.get("/", (req, res) => {
    let params = {};
    if (req.query.checkstring && req.query.string) {
      params["string"] = req.query.string
    }
    if (req.query.checkinteger && req.query.integer) {
      params["integer"] = req.query.integer
    }
    if (req.query.checkfloat && req.query.float) {
      params["float"] = req.query.float
    }
    if (req.query.checkdate && req.query.startdate && req.query.enddate) {
      params["date"] = {
        $gte: req.query.startdate,
        $lt: req.query.enddate
      }
    }
    if (req.query.checkboolean && req.query.boolean) {
      params["boolean"] = req.query.boolean
    }

    Todo.find(params).count((err, count) => {
      let page = req.query.page || 1;
      let limitpage = 4;
      let offset = (page - 1) * limitpage;
      let url = req.url == "/" ? "/?page=1" : req.url;
      let total = count;
      let pages = Math.ceil(total / limitpage);
      Todo.find(params, {
        limit: limitpage,
        skip: offset
      }).toArray((err, docs) => {
        res.render("index", {
          data: docs,
          page,
          pages,
          query: req.query,
          url
        });
      });
    });
  });

  router.get("/add", (req, res) => {
    res.render("add");
  });

  router.get("/edit/:id", (req, res) => {
    //let id = new mongodb.ObjectID(req.params.id)
    Todo.find({
      _id: new mongodb.ObjectID(req.params.id)
    }).toArray((err, data) => {
      if (err) throw err;
      res.render("edit", {
        item: data[0]
      });
    });
  });

  router.post("/add", (req, res) => {
    Todo.insertOne({
        string: req.body.string,
        integer: req.body.integer,
        float: req.body.float,
        date: req.body.date,
        boolean: req.body.boolean
      },
      (err, result) => {
        // console.log(err);
        res.redirect("/");
      }
    );
  });

  router.post("/edit/:id", (req, res) => {
    let id_object = new mongodb.ObjectID(req.params.id);
    Todo.updateOne({
        _id: id_object
      }, {
        $set: {
          string: req.body.string,
          integer: req.body.integer,
          float: req.body.float,
          date: req.body.date,
          boolean: req.body.boolean
        }
      },
      (err, result) => {
        //   console.log(result);
        if (err) throw err;
        res.redirect("/");
      }
    );
  });
  router.get("/delete/:id", function (req, res) {
    Todo.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
      },
      err => {
        if (err) throw err;
        res.redirect("/");
      }
    );
  });
  return router;
};