var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{  //存放录入或更新数据时时间的记录
		createAt:{
			type:Date,
			default:Date.now()  //创建时候的时间
		},
		updateAt:{
			type:Date,
			default:Date.now()  //创建时候的时间
		}
	}
})
//为该模式添加一个方法
//pre save 是说每次存储数据的时候都会调用这个方法
MovieSchema.pre('save',function(next){
	if(this.isNew){   //如果当前数据是新增的，创建时间=更新时间=当前时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{  //否则只更新updateAt
		this.meta.updateAt = Date.now()
	}
	next();  //这样存储流程才会继续走下去
})

//添加静态方法
//这个静态方法不会直接与数据库交互，只有经过模型编译 实例化以后才会具有这个方法
MovieSchema.statics = {
	fetch: function(cb){  //fetch方法用于取出目前数据库中所有的数据
		return this
			.find({})
			.sort('meta.updateAt')  //按照更新时间排序
			.exec(cb)  //执行回调方法
	}
	,findById: function(id,cb){  //findById方法用来查找单条的数据
		return this
			.findOne({_id:id})
			.exec(cb)  //执行回调方法
	}
}

//通过module.exports将此模式导出
module.exports = MovieSchema


//模式编写完以后去增加模型