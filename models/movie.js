//在此增加模型

var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie')  //拿到模块
var Movie = mongoose.model('Movie',MovieSchema)   //编译生成movie这个模型 通过调用 mongoose.model 传入模型的名字以及模式

//将此构造函数导出
module.exports = Movie
