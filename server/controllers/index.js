import * as Hero from './hero';
import fs from 'fs';
import path from 'path';

export default (app)=>{
  // pre handle user
  app.get('/',function(req, res, next) {
		  const html = fs.readFileSync(path.join(__dirname,'../../dist/index.html'))
      res.render('index',{html})
  })

  app.post('/api/upload/photo',Hero.uploadPhoto)
  // app.get('/', AppIndex.index);
  app.post('/api/insertHeroInfo', Hero.insertHeroInfo);

  app.post('/api/getHeroList', Hero.getHeroList);
	app.post('/api/deleteHeroList', Hero.deleteHeroList);
	app.post('/api/updateHeroList', Hero.updateHeroList);

}
