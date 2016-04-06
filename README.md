# 图片上传web组件 Upload 使用说明

## 引用方式

### js 引用

```
<div id="box"></div>
<script src="import/jquery.js"></script>
<script src="import/jquery.form.js"></script>
<script src="img.upload.ui.js"></script>
<script>
    var upload = new window.Upload();
    var callback = function(value) {
        // value 为上传成功后的图片url路径
        // 上传成功后，设置表单中的input值
    };
    upload.init({$parent: $('#box'), ajaxUrl: '/upload'}).after(callback);
</script>
```

### css 引用

	 <head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="css.css">
		<title>图片上传组件</title>
	</head> 


## API


**init 方法 @param {Object}**
   
   组件初始化需要调用该方法。 
   参数说明：
   Object.ajaxUrl  :  上传的ajax请求地址
   object.$parent  :  父容器,$Dom    
   object.value    :  初始化的图片路径
   object.imgTypeArray : 合法的图片格式，必须为数组，默认为 ["jpeg", "jpg", "png"]
   object.alert    :  上传失败异常提示弹出框，默认为 window.alert
   object.inputName : 上传图片接口定义的表单字段name ， 默认 "cover-example"，建议自定义设置
   
   例子：
   ```
   var upload = new window.Upload();
   upload.init({$parent: $('#box'), ajaxUrl: '/upload'});
   ```
-------------------

**after 方法 @parma {Function}**

   图片上传成功后的调用传入的回调方法， var callback = function(value) {};    
   回调方法接受的参数，value 为上传成功后图片 url 地址。（注：ajax请求返回的格式若不相同，请查看并修改组件内部 _ajax方法）

-------------------
**getValue 方法 @return {String}**    
   返回 图片 url。   


## 更新

   【2016-03-30】
   
   1. 添加支持可选择相同图片文件上传。
   2. 修改IE8下的BUG。   

   【2016-04-01】

   1. 修改组件内部表单 [input type="file"] name值没有还原问题。  