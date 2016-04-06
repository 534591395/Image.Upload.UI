// http://my.oschina.net/u/1866405/blog/301368
// 启动命名 supervisor --debug server  调试 node-inspector
// http://ourjs.com/detail/529ca5950cb6498814000005 学习教程
// https://cnodejs.org/topic/4f16442ccae1f4aa2700104d  -1
// http://www.cnblogs.com/imlucky/archive/2012/10/29/2744302.html -2  POST 实现 formidable--上传插件模块
// 调试工具 npm install -g node-inspector  首先启动服务，然后在新dos界面启动 node-inspector .哪里需要debugger,就添加debugger.
// chome浏览器下 访问 http://127.0.0.1:8080/debug?port=5858 ，port 是调试端口
// 监听文件变化，重启服务  npm install supervisor -g  || supervisor index
// 启动监听加文件变动启动服务命令 supervisor --debug server  
var path = require('path');
var fs = require("fs");
var express = require('express');
var formidable = require("formidable"); // 图片上传
var app = express();
var router = express.Router();

// 事件
var util = require('util');
var events = require('events');


var http = require('http').Server(app);


// 添加属性  Properties
app.locals.title = 'wangyangapp';
app.locals.email = '534591395@qq.com';

// 设置静态资源路径
app.use(express.static(path.join(__dirname, 'assets')));


// 设置模板
app.engine('html', require('ejs').renderFile);
app.set('views', './assets');
app.set("view engine", "html");


app.get('/', function(req, res) {
	res.render('index', { });
});

app.get('/loading', function(req, res) {
	console.log('loading');
	var data = {
		resultCode: 0,
		resultDes: '测试登录接口',
		cameraInfoList: []
	};
	res.writeHead(200,{"access-control-allow-origin":"*","Content-Type":"text/json"});
	res.write(JSON.stringify(data));
	res.end();
});

app.post('/upload', function(request,response) {
	// 未解决： IE8 下不知道什么原因，files值为空
   var form = new formidable.IncomingForm({uploadDir:"./assets/files"});
      	 console.log(request);
   form.parse(request, function(error, fields, files) {
   	 if(files.cover) {
   	 	fs.renameSync(files.cover.path, "./assets/files/upload.jpg"); 
   	 }
   	 //注意，设置的头部要改成 "Content-Type":"text/plain" 否则，IE8下会当成json文件下载
   	 response.writeHead(200,{"access-control-allow-origin":"*","Content-Type":"text/plain","charset":"utf-8"});;
   	 response.write(JSON.stringify({resultCode:'0',data: './files/upload.jpg?random='+Math.random()}));
     response.end();
   });
    
});



http.listen(18081, function() {
	console.log('start...');
	console.log('listening on *:18081');
});