import express from 'express';
import async from 'async';
import {db,ObjectID}  from './../common/db'
import { getFormatTime } from './../utils/utils'
const router = express.Router();

export const index = (req, res, next)=> {
  console.log('=====session',req.session.isLogin)
  //串行无关联
  async.series({
    one:function(callback){
      db.collection('articles').find({}).toArray((err, result)=>{
        if (err) throw err;
        result.map((item)=>{
          const timestamp = item._id.getTimestamp()
          item.createTime = getFormatTime(timestamp)
        })
        callback(null,result)
      });
    },
    two:function(callback){
      db.collection('comments')
        .aggregate({$group:{_id:"$arId",comments_num:{$sum:1}}},(err,result)=>{
        if(err) throw err;
        callback(null,result)
      })
    }
  },(err,result)=>{
    const {one,two} = result

    const finalResult =  one.map((item,index)=>Object.assign(item,two[index]))

    res.render('index', { articles: finalResult});

  })
}

export const likes = (req, res, next)=>{
  const { id, likes } = req.body
  db.collection('articles')
    .update({_id:ObjectID(id)},{$set:{likes:likes}},(err, result)=>{
      if (err) throw err;
      res.send({rs:true,likes:likes});
    });

}
