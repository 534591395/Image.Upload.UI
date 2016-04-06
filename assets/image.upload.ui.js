(function(root, $) {
	'use strict';

	var Upload = function() {};
	root.Upload = Upload;
	// 模板
	Upload.Tpl = {
	  	 'box': '<div class="coverBox">'+
	  	            '<div class="uploader-list">'+
	  	               '<img src="#" class="ImgPr hide"  width="232" height="164" class="hide">' +
	  	               '<div class="filePicker">' +
	  	                   '<div class="webuploader-pick">' +
	  	                       '<div class="file-picker-box">' +
	  	                          '<div class="bg"></div>' +  
	  	                          '<div class="rebtn">重新上传</div>' +
	  	                       '</div>' +
	  	                       '<div class="icon addIcon"></div>' +
	  	                       '<div class="loadImgBox">' +
	  	                          '<div class="bg"></div>' +
	  	                          '<div class="loadImg"><img src="/imgs/loading_60-60.gif" ></div>' +
	  	                       '</div>' +
	  	                   '</div>' +
	  	               '</div>' +
	  	            '</div>' +
	  	            '<input type="file"  class="coverUrlInput" name="cover-example">' + 
	  	        '</div>'
	};
    
    // 图片上传ajax接口
	Upload.prototype.ajaxUrl = '';
	Upload.prototype.inputName = 'cover';
	// 弹出框提示组件
	Upload.prototype.alert = function(string) { window.console && console.log(string); };
	// 上传成功后的图片路径 src
	Upload.prototype.value = '';
	// 当前 $Dom
	Upload.prototype.$Dom = '';
	// 当前 已操作的 file input 输入框
	Upload.prototype.$nowInput = '';
	// 当前 上传表单 Dom
	Upload.prototype.$UploadImgForm = '';
	// 当前允许上传图片文件格式
	Upload.prototype.ImgType = ["jpeg", "jpg", "png"];
	// 上传后触发的回调函数
	Upload.prototype._Callback = function() {};
	// 上传ajax方法
	Upload.prototype._ajax = function() {
		var that = this;
		var $file = that.$nowInput;
		that.$UploadImgForm.remove();
		$('body').append(that.$UploadImgForm);
		var $form = that.$UploadImgForm.append($file);
	    if($file.val() == '') {
	      	return false;
	    }
	    that.$Dom.find('.webuploader-pick').addClass('upLoading');
        if( typeof $form.ajaxSubmit == undefined) {
            throw '该模块依赖 jquery.form.js 插件，请引入！'; 
      	    return false;
        }
        $file.attr('name', that.inputName);
		$form.ajaxSubmit({
			 url: that.ajaxUrl,
			 type: 'post',
			 dataType: 'json',
			 contentType: 'multipart/form-data',
			 success: function($1) {
			 	that._hackInputFile(that.$nowInput);
			 	that.$Dom.find('.webuploader-pick').removeClass('upLoading');
			 	switch($1.resultCode){
			 		case '0':
			 		  that._Callback($1.data);
			 		  that._setValue($1.data);
			 		  break;
			 		default:
			 		  that.alert('图片上传失败');
			 		  break;         
			 	}
			 	that.render();
			 },
			 error: function(xhr, status, error) {
			 	that._hackInputFile(that.$nowInput);
			 	that.$Dom.find('.webuploader-pick').removeClass('upLoading');
			 	that.render();
	            if(xhr.status >= 500) {
	    			that.alert('服务器异常，稍后再试');
	    		} else {
	    			that.alert('操作失败，请检查网络连接~');
	    		} 
			 }
		});
		return that;
	};
	// 设置合法图片格式
	Upload.prototype._setImgType = function(typesArray) {
		this.ImgType = typesArray || this.ImgType;
		return this;
	};
	// 设置上传成功的图片路径
	Upload.prototype._setValue = function(value) {
		this.value = value;
	};
	// 事件
	Upload.prototype._event = function() {
		var that = this;
		var $cloneFile = '';
		that.$Dom.on('change', 'input[type="file"]', function(e) {
			var $target = $(e.target);
			var value = $target.val();
			$cloneFile = $target.clone();
			// 触发 input[type="file"] 的 change 事件
	  	 	setTimeout(function() {
	  	 		$target.remove();
	  	 		that.$Dom.append($cloneFile);
	  	 	},0);
			if(!value) {
				if(!RegExp("\.(" + that.ImgType.join("|") + ")$", "i").test(value.toLowerCase())) {
					that.alert("选择文件错误,图片类型必须是" + that.ImgType.join("，") + "中的一种");
					that._hackInputFile($target);
					that.$nowInput = "";
		  	 		return false;
				}
				that.$nowInput = $target;
				that._ajax();
			}
		});
	};
	// hack 方法， 触发 input[type="file"] 的 change 事件
	// 该方法 IE8 下使用有顺序，必须 ajax请求结束后才能执行该方法，否则上传文件大小为0。
	Upload.prototype._hackInputFile = function($fileDom) {
	    var that = this;
	 	var $cloneFile = $fileDom.clone();
	 	setTimeout(function() {
	 		$fileDom.remove();
	 		$cloneFile.attr('name','cover-example');
	 		that.$Dom.append($cloneFile);
	 	},0);
	};
	// 初始化组件
	// config.ajaxUrl --- 上传的ajax请求地址, config.$parent ---- 外部html容器
	// config.imgTypeArray --- 合法图片格式
	// config.value --- 默认图片的src路径，即默认值
	// config.alert --- 异常弹出框组件
	// config.inputName -- 表单字段名称
	Upload.prototype.init = function(config) {
		if(config && config.ajaxUrl) {
			this.ajaxUrl = config.ajaxUrl;
		}
		if(config && config.$parent) {
			this.$parent = config.$parent;
		}
		if(config && config.imgTypeArray) {
			if(toString.call(config.imgTypeArray) == "[object Array]" ) {
				this._setImgType(config.imgTypeArray);
			} else {
				throw "传入的参数 imgTypeArray 必须为一个数组";
			}
		}
		if(config && config.value) {
			this._setValue(config.value);
		}
		if(config && config.alert) {
			this.alert = config.alert;
		}
		if(config && config.inputName) {
			this.inputName = config.inputName;
		}
		this.render()._event();
		this.$UploadImgForm = $('<form id="UploadImgForm'+Math.floor(Math.random()*1000000)+'" class="hide"></form>');
		return this;
	};
    // 视图渲染
    Upload.prototype.render = function() {
		if(!this.$Dom) {
		    this.$Dom = $(Upload.Tpl.box);
		}
		if(this.value) {
			this.$Dom.find('img.ImgPr').attr('src', this.value).removeClass('hide');
			this.$Dom.find('.webuploader-pick').addClass('hasPic');
		}
		if(this.$parent) {
			if(!this.$parent.find('.coverBox').length) {
				this.$parent.append(this.$Dom);
			}
		}
		return this;
    }; 
    // 获取图片路径 
    Upload.prototype.getValue = function() {
    	return this.value;
    };
    // 图片上传后调用方法
    Upload.prototype.after = function(callback) {
    	this._Callback = callback || function() {};
    };

    if (typeof define === "function" && define.amd) {
        define(function () {
            return Upload;
        });
    }
})(this, $);