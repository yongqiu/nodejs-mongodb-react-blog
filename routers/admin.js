/**
 * Created by Wu Yongqiu on 2017/6/29.
 */

var express = require('express');
var router = express.Router();

// router.get('/user',function (req, res, next) {
//     res.send('router user');
// });
router.use(function (req, res, next) {
    if (!req.userCookies.isAdmin){
        res.send('对不起，只有管理员才能进入后台管理')
        return
    }
    next()
})

router.get('/', function (req, res, next) {
    res.send('管理首页')
})

module.exports = router;