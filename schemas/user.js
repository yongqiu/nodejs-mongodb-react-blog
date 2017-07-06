/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
//定义数据库表结构
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = blogSchema;