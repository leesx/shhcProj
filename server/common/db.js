//var db = require('mongoskin').db('mongodb://10.10.3.188:27017/blog');
//var db = require('mongoskin').db('mongodb://127.0.0.1:27017/blog');
const mongoskin= require('mongoskin');

module.exports={
	db : mongoskin.db('mongodb://127.0.0.1:27017/db_shhc'),
	ObjectID : mongoskin.ObjectID,
};
