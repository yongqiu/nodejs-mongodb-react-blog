/**
 * Created by Administrator on 2017/7/11.
 */
var mongoose = require('mongoose');
var userSchema  = require('../schemas/tags');

var tagModel = mongoose.model('Tags', userSchema);

module.exports = tagModel;