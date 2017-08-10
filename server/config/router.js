import * as Hero from '../controllers/hero';

export default (app)=>{
  // pre handle user
  app.get('/',function(req, res, next) {
      //next();
      res.render('index')

  })

  app.post('/api/upload/photo',Hero.uploadPhoto)
  // app.get('/', AppIndex.index);
  app.post('/api/insertHeroInfo', Hero.insertHeroInfo);

  app.post('/api/getHeroList', Hero.getHeroList);

}
