var express = require('express')
var path = require('path')  //需要取到静态资源（css，js）的路径,告诉express到bower_components下去查找
var mongoose = require('mongoose')   //引入mongoose模块 用来连接本地数据库
var mongoStore = require('connect-mongo')(express)
var _ = require('underscore') //里面有方法用新的字段替换掉老的字段
var Movie = require('./models/movie')  //加载模型
var User = require('./models/User')  //加载模型
var port = process.env.PORT || 3000  //从命令行中获取环境变量，process是全局变量
var app = express()
var serverStatic = require('serve-static') // 新版express4中，要独立安装static，npm install serve-static --save
var bodyParser = require('body-parser')  //bodyParser 已经不再与Express捆绑，需要独立安装。

var dbUrl = 'mongodb://localhost/imooc'
mongoose.Promise = global.Promise
mongoose.connect(dbUrl) //连接到本地数据库



app.set('views','./view/pages') //设置视图的根目录  views是固定写法，后面的 ./view为视图的路径
app.set('view engine','jade')  //设置默认的模板引擎为jade
//express的bodyparse方法可以将表单的数据格式化 新版express已不支持app.use(express.bodyParser());
//需要安装body-parser模块，npm install body-parser
//然后使用代码为：app.use(require('body-parser').urlencoded({extended: true}))
//app.use(express.bodyParse())
app.use(bodyParser.urlencoded({extended: true}))
/*app.use(express.static(path.join(_dirname,'bower_components')))*/ // express4中static方法需要独立加载

app.use(serverStatic('public'))
app.use(express.cookieParser())
app.use(express.session({
	secret:'imooc',
	store: new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))
//express.static 静态资源的获取
//_dirname 当前的目录

app.locals.moment = require('moment')

app.listen(port)  //监听端口
 
console.log('imooc stared on port'+port)  //打印日志，在控制台看服务是否成功的启动


/**
 * 编写主要页面的路由
 * express中浏览器访问页面都是以get方式提交请求的，
 * get里接收两个参数，一个是路由匹配的规则，一个是回掉方法
 * 回调方法里再注入两个方法，request,response 简写为req，res
 * 
 */

//index page
app.get('/',function(req,res){
	console.log('user in session: ')
	console.log(req.session.user)
	Movie.fetch(function(err,movies){  //在回调方法里拿到返回的movies
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'imooc 首页',
			movies:movies
		})
	})
})

//signup
app.post('/user/singup',function(req,res) {
	var _user = req.body.user // req.param('user')  这样也能拿到这个user信息
	
	console.log(_user)
	User.find({name:_user.name}, function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			return res.redirect('/')
		}else{
			var user = new User(_user)
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/userlist')
			})
		}
	})	
})

//signin
app.post('/user/singin',function(req,res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/')
		}
		user.comparePassword(password, function(err,isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user = user
				return res.redirect('/')
			}else{
				console.log('Password is not matched')
			}
		})
	})
})

//userlist page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){  //在回调方法里拿到返回的moviesgbm， ，【-，8nhjuyt放到服7uijnbgffcvfgtrdfcfvgtrdfrrrzgfgtry67uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title:'imooc 用户列表页',
			users:users
		})
	})
})


//detail page
app.get('/movie/:id',function(req,res){
	// 斜杠后的值 意思是我在url中就能将匹配到的/后面的值 
	// 通过req.params 来拿到id的参数值
	var id = req.params.id
	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:'imooc '+ movie.title,
			movie:movie
		})
	})
})

//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
})

//在列表页点更新的时候会重新回到后台录入页这个时候需要将电影的数据初始化到表单中，所以还要在加一个路由
//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie:movie
			})
		})
	}else{
		alert(0)
	}
})




//表单录入页 需要实现从表单提交过来以后电影数据的存储,拿到从后台录入页post过来的数据
// admin post movie
app.post('/admin/movie/new', function (req, res) {
	var id = req.body.movie._id
	var movieObj =req.body.movie
	//console.log(movieObj)
	var _movie
	if (id !== 'undefined'){//数据库更新
			Movie.findById(id, function (err,movie) {
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj) //新字段替换老字段，underscore模块
			_movie.save(function (err, movie) {
				if (err) {
				console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
		}else{//添加
			_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})
		_movie.save(function (err, movie) {
			if (err) {
			console.log(err)
			}
			//console.log(movie)
			res.redirect('/movie/' + movie._id)
		})
	}
})

//list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){  //在回调方法里拿到返回的movies
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc '+movies.title,
			movies:movies
		})
	})
})




//list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
})

/*app.set('port',3000)  

app.get('/',function(req,res){
	res.render('index',{'title':'imooc'})
})*/



