//每个项目的gruntfile里面都会使用一个基本的格式
//需要一个ruby函数，所有的代码都必须指定到这个函数里面
module.exports = function (grunt) {

	//定义任务
	grunt.initConfig({
		watch: {
	      jade: {
	        files: ['views/**'],
	        options: {
	          livereload: true
	        }
	      },
	      js: {
	        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
	        //tasks: ['jshint'],
	        options: {
	          livereload: true
	        }
	      },
	 
	    },

	    nodemon: {
	      dev: {
	        options: {
	          file: 'app.js',
	          args: [],
	          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
	          watchedExtensions: ['js'],
	          watchedFolders: ['./'], 
	          debug: true,
	          delayTime: 1,
	          env: {
	            PORT: 3000
	          },
	          cwd: __dirname
	        }
	      }
	    },

	    concurrent: {
	      tasks: ['nodemon', 'watch',],
	      options: {
	        logConcurrentOutput: true
	      }
	    }
	})


	// 加载之前安装的任务插件
	grunt.loadNpmTasks('grunt-contrib-watch')  //只要有文件添加修改删除，会重新执行在插件里注册好的任务
	grunt.loadNpmTasks('grunt-nodemon') //实时监听app.js 也就是入口文件 当app.js有改动时会自动重启app.js
	grunt.loadNpmTasks('grunt-concurrent') //针对慢任务开发的一个插件 慢任务指sass，less，优化构建的时间，同时可用来跑多个阻塞的任务

	//设置grunt的参数
	//目的是便于开发的时候不要因为一些语法的错误或警告而中断了grunt的整个服务
	grunt.option('force',true)

	//注册任务
	//默认执行concurrent的任务
	//concurrent里面包含nodemon 和 watch 两个任务
	grunt.registerTask('default',['concurrent'])  
}
