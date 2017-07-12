/**
 * Created by wyq on 2017/7/11.
 */
//定义数据库表结构
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: String,
    modifier: String,
    description: String,
    tags: Array
});

module.exports = articleSchema;