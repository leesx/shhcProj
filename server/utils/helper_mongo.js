// helper_mongo.js文件
// 作者freewolf
// 当然还是使用官方驱动
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var mongoLink = '';
// 这里修改成你的MongoLink字符串mongodb://user:password@yourserver

// 插入方法
var insert = function (collectionName, obj) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoLink, function (err, db) {
            if (err) reject(err);
            var collection = db.collection(collectionName);

            collection.insert(obj, {
                w: 1
            }, function (err, res) {
                db.close();
                if (err) reject(err);
                else resolve(res[0]);
            });
        });
    });
}
// 更新
var update = function (collectionName, obj) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoLink, function (err, db) {
            if (err) reject(err);
            var collection = db.collection(collectionName);
            collection.update({
                _id: new ObjectID(obj._id)
            }, obj, {
                upsert: true,
                w: 1
            }, function (err, res) {
                db.close();
                if (err) reject(err);
                else resolve(res);
            });
        });
    });
}
// 查找一个
var findOne = function (collectionName, query, option) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoLink, function (err, db) {
            if (err) reject(err);

            var collection = db.collection(collectionName);

            if (option == undefined || option == null) {
                collection.findOne(query, function (err, res) {
                    db.close();
                    if (err) reject(err);
                    else resolve(res);
                });
            } else {
                collection.findOne(query, option, function (err, res) {
                    db.close();
                    if (err) reject(err);
                    else resolve(res);
                });
            }
        });
    });
}
// 查找多个
var find = function (collectionName, query, option) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoLink, function (err, db) {
            if (err) reject(err);

            var collection = db.collection(collectionName);
            if (option == undefined || option == null) {
                collection.find(query).toArray(function (err, res) {
                    db.close();
                    if (err) reject(err);
                    else resolve(res);
                });
            } else {
                collection.find(query, option).toArray(function (err, res) {
                    db.close();
                    if (err) reject(err);
                    else resolve(res);
                });
            }
        });
    });
}
// 删除
var remove = function (collectionName, query) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoLink, function (err, db) {
            if (err) reject(err);
            var collection = db.collection(collectionName);

            collection.remove(query, {
                w: 1
            }, function (err, res) {
                db.close();
                if (err) reject(err);
                else resolve(res);
            });
        });
    });
}
// 计数
var count = function (collectionName, query, option) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(mongoLink, function (err, db) {
            if (err) reject(err);
            var collection = db.collection(collectionName);
            if (query == undefined || query == null)
                query = {};
            if (option == undefined || option == null) {
                collection.count(query, function (err, count) {
                    db.close();
                    if (err) reject(err);
                    else resolve(count);
                });
            } else {
                collection.count(query, option, function (err, count) {
                    db.close();
                    if (err) reject(err);
                    else resolve(count);
                });
            }
        });
    });
}

module.exports.insert = insert;
module.exports.update = update;
module.exports.findOne = findOne;
module.exports.find = find;
module.exports.remove = remove;
module.exports.count = count;
