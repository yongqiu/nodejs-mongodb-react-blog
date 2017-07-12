/**
 * Created by Administrator on 2017/7/11.
 */
//定义数据库表结构
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagsSchema = new Schema({
    tagname: String,
    color: String
});

module.exports = tagsSchema;