/**
 * Created by Wu Yongqiu on 2017/6/29.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User')
var Tags = require('../models/Tags')
var Article = require('../models/Article')
var User = require('../models/User')

//用户分类列表
router.post('/getUserList', function (req, res, next) {
    /*
     * 从数据库中读取所有数据
     *
     * limit(Number): 限制获取的数据条数
     * skip(Number): 忽略数据的条数，从第一条开始
     *
     * 计算规则：
     * 每页显示5条：
     * currentPage = 1: 1-5 skip:0,limit:5
     * currentPage = 2: 6-10 skip:5,limit:5
     * currentPage = 3: 11-15 skip:10,limit:5
     * ...
     * 所以变量skip = (currentPage-1)*limit
     * */
    var currentPage = req.body.page
    var limit = req.body.limit
    var skip = (currentPage - 1)*limit
    User.find().then(function (userlist) {
        //获取user表里所有的数据，储存总条数
        var totalCount = userlist.length
        //再获取筛选后的数据
        User.find().limit(limit).skip(skip).then(function (userlist) {
            var responseData = {
                totalCount: totalCount,
                data: userlist
            }
            //返回筛选后的数据和总条数
            res.json(responseData)
        })
    })

})
/*
* 用户信息修改
* */
router.post('/editUserInfo', function (req, res, next) {
    var name = req.body.username
    var isAdmin = req.body.isAdmin
    var _id = req.body._id

    User.findOne({
        _id:_id
    }).then(function (userInfo) {
        //没有进行修改
        if (name == userInfo.username){
            var responseData = {
                code: 200,
                message: '修改成功'
            }
            res.json(responseData)
            return;
        }
        return User.findOne({
            username: name
        })
    }).then(function (sameUsernma) {
        if (sameUsernma){
            var responseData = {
                code: 400,
                message: '用户名已存在'
            }
            res.json(responseData)
        }else {
            return User.update({
                _id: _id
            },{
                username: name,
                isAdmin: isAdmin
            })
        }
    }).then(function () {
        var responseData = {
            code: 200,
            message: '修改成功'
        }
        res.json(responseData)
    })
})

/*
* 用户信息删除
* */
router.post('/deleteUserInfo', function (req, res, next) {
    var _id = req.body._id
    User.remove({
        _id: _id
    }).then(function () {
        var responseData = {
            code: 200,
            message: '删除'
        }
        res.json(responseData)
    })
})

/*
* 添加标签
* */
router.post('/addArticleTags', function (req, res, next) {
    var tags = req.body.tags
    tags.forEach(function (value, index) {
        Tags.findOne({
            tagname: value
        }).then(function (item) {
            if (!item){
                var tag = new Tags({
                    tagname: value
                })
                return tag.save();
            }
        })
    })
    var responseData = {
        code: '0000',
        message: '标签添加成功'
    }
    res.json(responseData)
})

/*
* 获取标签库
* */
router.get('/getArticleTags', function (req, res, nex) {
    var array = new Array();
    Tags.find({},{"tagname":1,"_id":0}).then(function (item) {
        item.forEach(function (value, index) {
            array.push(value.tagname)
        })
        var responseData = {
            tagArray: array,
        }
        res.json(responseData)
    })
})

/*
* 新增文章
* */
router.post('/addArticle', function (req, res, next) {
    var title = req.body.title
    var modifier = req.body.modifiers
    var description = req.body.smde
    var date = req.body.date
    let tags = req.body.tags
    var article = new Article({
        title: title,
        modifier: modifier,
        description: description,
        tags: tags,
        date: date
    })
    article.save();
    var responseData = {
        code: '0000',
        message: 'success'
    }
    res.json(responseData)
})

/*
* 获取文章列表
* */
router.post('/getArticle', function (req, res) {
    var currentPage = req.body.page
    var limit = req.body.limit
    var skip = (currentPage - 1)*limit
    Article.find().then(function (articlelist) {
        //获取user表里所有的数据，储存总条数
        var totalCount = articlelist.length
        //再获取筛选后的数据
        Article.find().limit(limit).skip(skip).then(function (item) {
            var array = new Array();
            item.forEach(function (value, index) {
                array.push(value)
            })
            var responseData = {
                totalCount: totalCount,
                ArticleList: array
            }
            //返回筛选后的数据和总条数
            res.json(responseData)
        })
    })
})

/*
* 获取文章detail
* */
router.get('/getArticleDetail', function (req, res, next) {
    let id = req.query.id
    Article.findOne({
        _id: id
    }).then(function (item) {
        res.json(item)
    })
})

/*
* 删除文章
* */
router.get('/deleteArticle', function (req, res, next) {
    let id = req.query.id
    Article.remove({
        _id: id
    }).then(function () {
        var responseData = {
            code: 200,
            message: '删除成功'
        }
        res.json(responseData)
    })
})

/*
* 管理员登陆
* */
router.post('/login', function (req, res, next) {
    let username = req.body.username
    let password = req.body.password
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        var responseData = {}
        if(!userInfo){
            responseData = {
                code : 1,
                message : "用户名或密码错误"
            }
            res.json(responseData)
            return;
        }else{
            if (!userInfo.isAdmin){
                responseData = {
                    code : 2,
                    message : "该用户不是管理员"
                }
                res.json(responseData)
                return;
            }
            responseData = {
                code : 0,
                message : "登陆成功"
            }
            res.json(responseData)
        }
    })
})


module.exports = router;