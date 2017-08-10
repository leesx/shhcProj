import { db, ObjectID }  from './../common/db'
import sha1 from 'sha1';
import async from 'async';


export const reg = (req, res, next)=>{
  res.render('user/reg')
}

export const regApi = (req, res, next)=>{

  const username = req.body.username
  const password = sha1(req.body.password)

  //串行前后有关联
  async.waterfall([
    function(callback){
      db.collection('user')
        .findOne({username:username},(err,result)=>{
          if(err) throw err;
          callback(null,result)
        })
    }
  ],function(error,finalResult){
    if(finalResult !== null && finalResult._id){
      res.send({
        rs:0,
        error:'用户名已经占用',
      })
    }

    const user = {}
    // 将用户信息存入 session
    //delete user.password;
    user.username = username
    req.session.user = user
    db.collection('user')
      .insert({username:username,password:password},(err, result)=>{
        if (err) throw err;
        //console.log('-----',result);
        //注意 最后返回的结果 是res.send()方法
        res.send({ rs:1 });
      });
  })

}


export const login = (req, res, next)=>{
  res.render('user/login')
}

export const loginApi = (req, res, next)=>{
  const username = req.body.username
  const password = sha1(req.body.password)

  db.collection('user')
    .findOne({username:username,password:password},(err,result)=>{
      if(err) throw err;

      if(result){
        req.session.isLogin = 1;
        req.session.username = username;
        res.send({rs:1})
      }
    })
}

export const loginout = (req,res,next)=>{
  if(req.session.isLogin){
    req.session.isLogin = null
    req.session.username = null
    res.redirect('/')
  }
}
