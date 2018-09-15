var Channel = require('../models/Channel');
var bodyparser = require('body-parser');

module.exports = function(router) {
  router.use(bodyparser.json());

  // this route gets all channels
  router.get('/channels', function(req, res) {

    Channel.find({private: false },{name: 1, id:1,owner:1,between:1,private:1, _id:0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });

  // this route returns all channels including private channels for that user
  router.get('/channels/:name', function(req, res) {

    Channel.find({ $or: [ {name:'Lobby'},{between: req.params.name},{owner:req.params.name} ] }, {name: 1, id:1, private: 1, between: 1,owner:1, _id:0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  })

  // post a new user to channel list db
  router.post('/channels/new_channel', function(req, res) {
    var newChannel = new Channel(req.body);
    newChannel.save(function (err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });
  // post a new user to channel list db
  router.get('/channels/join/:user/:channel', function(req, res) {
    Channel.update({id:req.params.channel}, {$addToSet:{between:req.params.user}})
    Channel.find({ $or: [ {name:'Lobby'},{between: req.params.name},{owner:req.params.name} ] },{name: 1, id:1,owner:1,between:1,private:1, _id:0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });
  // post a new user to channel list db
  router.get('/channels/delete/:channel', function(req, res) {
    Channel.remove({id:req.params.channel},true);
    Channel.find({private: false },{name: 1, id:1,owner:1,between:1,private:1, _id:0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });
}
