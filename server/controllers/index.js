import * as Hero from './hero';
import fs from 'fs';
import path from 'path';

export default (app)=>{
  // pre handle user
  app.get('*',function(req, res, next) {
		try{
			const html = process.env.NODE_ENV === 'development' ? renderHtml() : fs.readFileSync(path.join(__dirname,'../../dist/index.html'))

			res.render('index',{html})
		}catch(err){
			console.error(err)
			next()
		}

  })

  app.post('/api/upload/photo',Hero.uploadPhoto)
  // app.get('/', AppIndex.index);
  app.post('/api/insertHeroInfo', Hero.insertHeroInfo);

  app.post('/api/getHeroList', Hero.getHeroList);
	app.post('/api/deleteHeroList', Hero.deleteHeroList);
	app.post('/api/updateHeroList', Hero.updateHeroList);
	app.post('/api/getMusicList', Hero.getMusicList);
	app.post('/api/uploadMusic', Hero.uploadMusic);
	app.post('/api/removeMusic', Hero.removeMusic);

}

function renderHtml(){
	return `
		<!doctype html>
		<html>
			<head>
				<title>水浒画册</title>
				<meta charset="utf-8" />
				<meta name="keywords" content="react,react-router,immutablejs,loadsh.js,es2015,webpack3.0" />
				<meta name="description"  content="this is a react project,only study" />
				<style>

				</style>
				<script defer src="//at.alicdn.com/t/font_13r0wp30od97wrk9.js"></script>
			</head>
			<body>

				<div id="root">

				</div>

				<script  async src="https://cdn.bootcss.com/babel-polyfill/6.22.0/polyfill.min.js"></script>
				<script src="http://192.168.4.233:3031/dist/scripts/common/vendor.js"></script>
				<script  src="http://192.168.4.233:3031/dist/scripts/index.js"></script></body>

			</body>
		</html>

		`
}
