var express = require('express')
var path = require('path')  //需要取到静态资源（css，js）的路径,告诉express到bower_components下去查找
var mongoose = require('mongoose')   //引入mongoose模块 用来连接本地数据库
var port = process.env.PORT || 3000  //从命令行中获取环境变量，process是全局变量
var app = express()
var serverStatic = require('serve-static') // 新版express4中，要独立安装static，npm install serve-static --save
var bodyParser = require('body-parser')  //bodyParser 已经不再与Express捆绑，需要独立安装。

mongoose.connect('mongodb://localhost/imooc') //连接到本地数据库



app.set('views','./view/pages') //设置视图的根目录  views是固定写法，后面的 ./view为视图的路径
app.set('view engine','jade')  //设置默认的模板引擎为jade
//express的bodyparse方法可以将表单的数据格式化 新版express已不支持app.use(express.bodyParser());
//需要安装body-parser模块，npm install body-parser
//然后使用代码为：app.use(require('body-parser').urlencoded({extended: true}))
//app.use(express.bodyParse())
app.use(bodyParser.urlencoded({extended: true}))
/*app.use(express.static(path.join(_dirname,'bower_components')))*/ // express4中static方法需要独立加载
app.use(serverStatic('bower_components'))
//express.static 静态资源的获取
//_dirname 当前的目录
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
	res.render('index',{
		title:'imooc 首页',
		movies:[{
			title:"机械战警",
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title:"机械战警",
			_id:2,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title:"机械战警",
			_id:3,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title:"机械战警",
			_id:4,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title:"机械战警",
			_id:5,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title:"机械战警",
			_id:6,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		}]
	})
})

//detail page
app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title:'imooc 详情页',
		movie:{
			doctor:'何塞.派迪莉娅',
			country:'美国',
			title:'机械战警',
			year:2014,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			language:'英语',
			flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			summary:'翻拍自1987年同名科幻经典,由《精英部队》导演何塞.派迪莉娅指导的新片。。。'
		}
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

//list page
app.get('/admin/list',function(req,res){
	res.render('list',{
		title:'imooc 列表页',
		movies:[{
			title:'机械战警',
			_id:1,
			doctor:'何塞.派迪莉娅',
			country:'美国',
			title:'机械战警',
			year:2014,
			language:'英语',
			flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
		}]
	})
})
/*app.set('port',3000)  

app.get('/',function(req,res){
	res.render('index',{'title':'imooc'})
})*/