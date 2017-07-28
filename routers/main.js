/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
//首页
router.get('/', function (req, res, next) {
    res.render('./main/index')
});
//其他页
router.get('/page', function (req, res, next) {
    res.render('./main/index')
});
//详情页
//其他页
router.get('/details', function (req, res, next) {
    res.render('./main/details.html')
});
module.exports = router;