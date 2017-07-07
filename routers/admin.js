/**
 * Created by Wu Yongqiu on 2017/6/29.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User')

router.post('/api/getUserList', function (req, res, next) {
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
    var page = req.body.page
    var limit = req.body.limit
    var skip = (page - 1)*limit
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


module.exports = router;