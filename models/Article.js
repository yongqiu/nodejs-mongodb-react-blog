/**
 * Created by Administrator on 2017/7/11.
 */
var mongoose = require('mongoose');
var userSchema  = require('../schemas/article');

var articleModel = mongoose.model('Article', userSchema);

module.exports = articleModel;