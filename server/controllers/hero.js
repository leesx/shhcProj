import fs from 'fs';
import formidable from 'formidable';

import {db, ObjectID}  from './../common/db'
import {getFormatTime} from './../utils/utils'


export const search = (req, res, next) => {
    const keyword = req.query.keyword

    db.collection('articles')
        .find({$or: [{title: {$regex: keyword}}, {content: {$regex: keyword}}]})
        .toArray((err, result) => {

            result.map(function (item) {
                const regex     = new RegExp(keyword, 'ig')
                const reTitle   = item.title.replace(regex, '<span class="search-tag">' + keyword + '</span>')
                const reContent = item.content.replace(regex, '<span class="search-tag">' + keyword + '</span>')
                item.title      = reTitle
                item.content    = reContent
            })

            res.render('article/search', {articles: result});
        })
}

export const getHeroList = (req, res, next) => {
    const category = req.query.category

    db.collection('heroes')
        .find({})
        .toArray((err, result) => {
            if (err) throw err;
            const resultArr = [];
            console.log(result)
            result.forEach((item) => {
                const timestamp = item._id.getTimestamp()
                item.createTime = getFormatTime(timestamp)
                resultArr.push(item)
            })
            res.send({rs:'ok',msg:'成功',data: resultArr});
        });
}

{
}

export const list = (req, res, next) => {
    db.collection('articles')
        .find({}).toArray((err, result) => {
        if (err) throw err;
        const resultArr = []
        result.forEach((item, index) => {
            const timestamp = item._id.getTimestamp()

            item.createTime = getFormatTime(timestamp)
            resultArr.push(item)
        })
        res.render('article/list', {news_lists: resultArr});
    });
}


export const detail = (req, res, next) => {
    const id = req.query.id
    db.collection('articles')
        .findOne({_id: ObjectID(id)}, (err, articlesResult) => {
            if (err) throw err;

            db.collection('comments')
                .find({arId: id})
                .toArray((err, result) => {
                    if (err) throw err;
                    const resultArr = []
                    result.forEach((item, index) => {
                        const timestamp = item._id.getTimestamp()

                        item.createTime = getFormatTime(timestamp)

                        if (item.replys && item.replys.length) {
                            const replysArr = []
                            item.replys.forEach((replyItem) => {
                                replysArr.push({
                                    repCont: replyItem.repCont,
                                    repTime: getFormatTime(replyItem.repTime)
                                })
                            })
                            item.replys = replysArr
                        }

                        resultArr.push(item)
                    })

                    //注意 最后返回的结果 是res.send()方法
                    res.render('article/detail', {comments: resultArr, detail: articlesResult})
                });

        });


}

export const update = (req, res, next) => {
    const id = req.query.id

    db.collection('articles')
        .findOne({_id: ObjectID(id)}, (err, result) => {
            if (err) throw err;
            res.render('article/update', {detail: result, isLogin: req.session.isLogin});
        });
}

export const articleUpdate = (req, res, next) => {
    // POST 请求在req.body中取值
    //GET 请求在req.query中取值
    const {id, title, author, category, content, img} = req.body
    db.collection('articles')
        .update({_id: ObjectID(id)}, {
            $set: {
                title,
                author,
                category,
                content,
                img,
            }
        }, (err, result) => {
            if (err) throw err;
            //注意 最后返回的结果 是res.send()方法
            res.send({rs: 'ok'});
        });
}

export const insertHeroInfo = (req, res, next) => {
    // POST 请求在req.body中取值
    //GET 请求在req.params中取值
    const {name,alias,title, content, final, rank, photolist, scope, skill, star} = req.body
    db.collection('heroes').insert({
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
    console.log('上传================')
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {


        try {
            // 从临时目录读取文件的内容
            const fileContent = fs.readFileSync(files.photo.path)

            //把读取的内容写到当前文件夹下,文件名叫做 files.myfile.name
            const filename = 'shhc_' + files.photo.name
            fs.writeFileSync('./server/public/upload/' + filename, fileContent)

            //写入响应中
            // res.write(files.myfile.name);
            //
            // filename = files.myfile.name;

            res.send('/upload/' + filename);
        } catch (e) {
            fs.unlink(req.files.photo.path);
        }
    })

}

export const remove = (req, res, next) => {
    const id = req.body.id
    db.collection('articles')
        .remove({_id: ObjectID(id)}, (err, result) => {
            if (err) throw err;
            res.send({rs: 'ok'});
        });
}
