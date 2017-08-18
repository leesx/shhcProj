import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Controllers from './controllers'
import {sessionConfig} from './config/session' ;
const MongoStore = require('connect-mongo')(session);


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//设置多个静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
if(process.env.NODE_ENV === 'production'){
	app.use(express.static(path.join(__dirname, '../dist')));
}


// session 中间件
app.use(session({
  name: sessionConfig.key,// 设置 cookie 中保存 session id 的字段名称
  secret: sessionConfig.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: sessionConfig.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  resave:true,
  saveUninitialized:true,
  store: new MongoStore({// 将 session 存储到 mongodb
    url: 'mongodb://127.0.0.1:27017/db_shuihu'// mongodb 地址
  })
}));

// flash 中间价，用来显示通知
app.use(flash());


// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.isLogin = req.session.isLogin;
  res.locals.username = req.session.username;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});




Controllers(app)



// catch 404 and forward to error handler
app.use((req, res, next)=>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 开发环境 development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产环境 production error handler
// no stacktraces leaked to user
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
