/*
* 启动入口文件
* */
const NODE_ENV = process.env.NODE_ENV
const __DEV__ = NODE_ENV === 'development'
const _PRODUCT_ = NODE_ENV === 'production'

//加载express
var express = require('express')
//加载html模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser用来处理前端提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');
//创建服务app 相当于nodejs中的Http.createServer
var app = express();
//读取数据表User
var User = require('./models/User')
//设置请求头
var allowCrossDomain = function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}

//解决跨域问题
app.use(allowCrossDomain);
//静态文件托管
app.use('/public',express.static( __dirname +'/public'))
//配置应用使用的模板
app.engine('html', swig.renderFile);
//注册所使用的模板引擎，第一个参数必须是view engine
app.set('view engine','html');
//设置模板文件存放的目录，第一个参数必须是views
//第二个参数是路径目录
app.set('views','./views');
//清除浏览器缓存，使每次刷新能够看到改变
swig.setDefaults({cache: false});

//bodyParser 相关参数设置
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//设置Cookies
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res)
    //解析cookies
    req.userCookies = {}
    if (req.cookies.get('userInfo')){
        //将cookies中的userInfo提取出来放在userCookies中
        req.userCookies = JSON.parse(req.cookies.get('userInfo'));
    }
    next()
})

/*
* 配置请求路由
*/
app.use('/api', require('./routers/api'));  //前端页面的api 路由
app.use('/admin/api', require('./routers/api_admin')); // admin的api路由
app.use('/', require('./routers/main'));    //前端展示页面路由
app.use('/admin', require('./routers/admin'));    //后端展示页面路由

console.log(1232331)
if (__DEV__){
    mongoose.connect( 'mongodb://39.108.13.1:27017/myblog', function (err) {
        if (err) {
            console.log('数据库连接失败')
        }else {
            console.log('数据库连接成功');
            app.listen(8888);
        }
    });
}
if (_PRODUCT_){
    mongoose.connect( 'mongodb://39.108.13.1:27017/myblog', function (err) {
        if (err) {
            console.log('数据库连接失败')
        }else {
            console.log('数据库连接成功');
            app.listen(8888);
        }
    });
}


//连接数据库
// mongoose.connect( 'mongodb://127.0.0.1:27017/myblog', function (err) {
//     if (err) {
//         console.log('数据库连接失败')
//     }else {
//         console.log('数据库连接成功');
//         app.listen(8888);
//     }
