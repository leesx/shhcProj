import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

import {db, ObjectID}  from './../common/db';
import {getFormatTime} from './../utils/utils';
import moment from 'moment'

const Heroes = db.collection('heroes');
export const getHeroList = (req, res, next) => {
    const {currentPage=0,pageSize=5} = req.body
    //编辑
		if(req.body.id){
			Heroes
	        .findOne({_id:ObjectID(req.body.id)},(err, result)=>{
						if (err) throw err;
						console.log(result)
						res.send({rs:'ok',msg:'成功',data: result});
					})

		}else{
      //获取列表
      const total = Heroes.count(function(err,total){
        if (err) throw err;

	    Heroes.find({})
	          .skip((currentPage-1)*pageSize)
	          .limit(pageSize*1)
		        .toArray((err, result) => {
		            if (err) throw err;
		            res.send({rs:'ok',msg:'成功',total,currentPage,data: result});
		        });
      });
		}

}

export const deleteHeroList = (req, res, next) => {

		const id = req.params.id
    Heroes.remove({_id: ObjectID(id)}, (err, result) => {
            if (err) throw err;
						// Heroes.findOne({_id: ObjectID(id)},(err,result))
						// console.log('删除',result)
						//fs.unlink();
            res.send({rs: 'ok',msg:'成功'});
        });
}



export const updateHeroList = (req, res, next) => {
    const {id,name,alias,title, content, final, rank, photolist, scope, skill, star} = req.body
    Heroes.update({_id: ObjectID(id)}, {
            $set: {
							name,
							alias,
							title,
							content,
							final,
							rank,
							photolist,
							scope,
							skill,
							star,
            }
        }, (err, result) => {
            if (err) throw err;
            res.send({rs: 'ok',msg:'成功'});
        });
}

export const insertHeroInfo = (req, res, next) => {
    // POST 请求在req.body中取值
    //GET 请求在req.params中取值
    const {name,alias,title, content, final, rank, photolist, scope, skill, star} = req.body
    Heroes.insert({
        name,
        alias,
        title,
        content,
        final,
        rank,
        photolist,
        scope,
        skill,
        star,
    }, (err, result) => {
        if (err) throw err;
        //console.log('-----',result);
        //注意 最后返回的结果 是res.send()方法
        res.send({rs: 'ok', msg: '添加信息成功'});
    });
}

export const uploadPhoto = (req, res, next) => {
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        try {
            // 从临时目录读取文件的内容
            const fileContent = fs.readFileSync(files.photo.path)

            //把读取的内容写到当前文件夹下,文件名叫做 files.myfile.name
            const filename = 'shhc_' + files.photo.name;
						const writerPath = path.join(__dirname, '../public/upload',filename);
            fs.writeFileSync(writerPath, fileContent)
            res.send('/upload/' + filename);
        } catch (e) {
            fs.unlink(req.files.photo.path);
        }
    })
}

export const getMusicList = (req,res,next) =>{
	db.collection('music').find({}).toArray((err,result)=>{
		if(err) throw err;
		res.send({
			rs:true,
			msg:'成功',
			data:result
		})
	})
}
export const uploadMusic = (req, res, next) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        try {
						console.log('音乐',files.file.path)
            // 从临时目录读取文件的内容
            //const fileContent = fs.readFileSync(files.file.path)

            //把读取的内容写到当前文件夹下,文件名叫做 files.myfile.name
            let filename = files.file.name
						// 创建一个可读流
						const readerStream = fs.createReadStream(files.file.path);

						// 创建一个可写流
						const writerStreamPath = path.join(__dirname, '../public/upload/music',filename);
						const writerStream = fs.createWriteStream(writerStreamPath);

						// 管道读写操作
						// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
						fs.exists(writerStreamPath, function(exists){
							if(!exists){
								readerStream.pipe(writerStream);
							}else{
								filename = Date.now()+filename;
								const newPath = path.join(__dirname, '../public/upload/music',Date.now()+filename);
								const newWriterStream = fs.createWriteStream(newPath);

								readerStream.pipe(newWriterStream);
							}
						})


						readerStream.on('end',function(){
						   const {lastModifiedDate,name,size,type} = files.file;
							 db.collection('music')
					         .insert({
										 lastModifiedDate,
										 name,
										 url:'/upload/music/' + filename,
										 size,
										 type,
					         }, (err, result) => {
					             if (err) throw err;
					             res.send({
												 rs: true,
												 msg:'成功',
											 });
					         });
						});

						readerStream.on('error', function(err){
						   console.log(err.stack);
						});
        } catch (e) {
            fs.unlink(files.file.path);
        }
    })

}

export const removeMusic = (req, res, next) => {
		const {id,url} = req.body
    db.collection('music')
        .remove({_id: ObjectID(id)}, (err, result) => {
            if (err) throw err;
						const removePath = path.join(__dirname,'../public',url);
						try{
							fs.unlink(removePath);
						}catch(err){
							console.error(err)
						}
            res.send({rs: true,msg:'成功'});
        });
}
