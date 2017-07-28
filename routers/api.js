/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
//引入models
var User = require('../models/User')
var Article = require('../models/Article')
var Tags = require('../models/Tags')


// 所有路径的api请求，都默认返回的参数
var responseData;
router.use(function (req,res,next) {
    responseData = {
        code:0,
        message:''
    };

    next();
})
/*
* test
* */
router.post('/user/test', function (req, res, next) {
    res.json(responseData)
})
/*
* 前端读取cookies
* */
router.post('/user/cookies', function (req, res, next) {
    res.json(req.userCookies)
})
/*
 * 注销登陆
 * */
router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null)
    res.json(responseData)
})
/*
* 用户注册
* */
router.post('/user/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
//  表单验证
    if(username === ''){
        responseData = {
            code : 1,
            message : "用户名不能为空"
        };
        res.json(responseData); //res.json 将对象转化为json格式传给前端
        return;
    }
    if(password === ''){
        responseData = {
            code : 2,
            message : "密码不能为空"
        };
        res.json(responseData);
        return;
    }
    if(password !== repassword){
        responseData = {
            code : 3,
            message : "两次输入的密码不一致"
        };
        res.json(responseData)
        return;
    }

    //检查用户名是否已被注册
    User.findOne({
        username: username
    }).then(function (userInfo) {
        //返回查询到的数据或者null
        if (userInfo){
            responseData = {
                code: 4,
                message: "用户名已存在"
            }
            res.json(responseData)
            return
        }
        //查询到userInfo 为 null时,储存数据到数据库
        var user = new User({
            username: username ,
            password: password
        })
        return user.save();
    }).then(function () {
        responseData.message="注册成功";
        res.json(responseData)
        //注册成功后是否将注册信息储存到cookie
    })
});
/*
* 用户登录
* */
router.post('/user/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if(username === ''){
        responseData = {
            code : 1,
            message : "用户名不能为空"
        };
        res.json(responseData); //res.json 将对象转化为json格式传给前端
        return;
    }
    if(password === ''){
        responseData = {
            code : 2,
            message : "密码不能为空"
        };
        res.json(responseData);
        return;
    }
    //验证
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo){
            responseData = {
                code : 3,
                message : "用户名或密码错误"
            }
            res.json(responseData)
            return;
        }
        responseData = {
            code : 0,
            message : "登陆成功",
            userInfo: userInfo
        }
        req.cookies.set('userInfo', JSON.stringify({
            userId: userInfo._id,
            userName: userInfo.username,
            isAdmin: userInfo.isAdmin
        }))
        res.json(responseData)
        return;
    })
})

/*
* 获取文章列表
* */
router.get('/user/getAllArticle', function (req, res, next) {
    var currentPage = req.query.page;
    var limit = 5;
    var skip = (currentPage - 1)*limit;
    Article.find().then(function (aLLAriticle) {

        // //获取user表里所有的数据，储存总条数
        var totalCount = aLLAriticle.length
        // //再获取筛选后的数据
        Article.find().limit(limit).skip(skip).then(function (articleList) {
            var responseData = {
                totalCount: totalCount,
                data: articleList,
            }
            // console.log(responseData)
            // //返回筛选后的数据和总条数
            res.json(responseData)
        })
    })
})

/*
* 获取标签
* */
router.get('/user/getAllTags', function (req, res) {
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

module.exports = router