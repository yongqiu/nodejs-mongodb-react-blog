/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var mongoose = require('mongoose');
var userSchema  = require('../schemas/user');

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;