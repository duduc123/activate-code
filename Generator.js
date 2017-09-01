function Generator(options){
	var _this = this;
	var _encodingMethod = 'hex';//buffer转字符串的编码方式，用于客户端公钥和加密结果转成字符串 ascii\base64\binary\hex
	const protocalId = 11;//本数据传输协议的编号，自定义
	const protocalVersion = 1;//本数据传输协议的版本号，自定义
	var _ip = options.ip;//服务器IP
	var _port = parseInt(options.port);//服务器端口
	var _userId = parseInt(options.userId);//用户编号
	var _softwareId = parseInt(options.softwareId);//待激活软件编号
	var _softwareVersion = parseInt(options.softwareVersion);//待激活软件版本号
	
	var _verifyNum;//验证码
	var _userData;//
	var _code;//“http://........”用于生成二维码的字符串
	
	var _http = require('http');
	var _querystring = require('querystring');
	var _contents  =  _querystring.stringify({
		name:'getKey'
	});
	var _options = {
		host:_ip,//host:'10.10.10.152',
		path:'/key',
		port:_port,
		method:'POST',
		headers:{
			'Content-Type':'application/x-www-form-urlencoded',
			'Content-Length':_contents.length
		}
	};
    this.setReturnNum = function(PKs){
		if(_userId < 4294967296 &&  _softwareId < 65536 & _softwareVersion < 65536){
				var now = new Date();
				var buffer = new Buffer(16);
				buffer.writeUIntBE(protocalId,0,1);
				buffer.writeUIntBE(protocalVersion,1,1);
				buffer.writeUIntBE(_userId,2,4);
				buffer.writeUIntBE(_softwareId,6,2);
				buffer.writeUIntBE(_softwareVersion,8,2);
				buffer.writeUIntBE(now.getTime(),10,6);
				_userData = buffer;
		}
		else{
			throw new error("parseInt(argument) has been out of range:arg1 should be smaller than 4294967296,arg2 and arg3 should be smaller than 65536");
		}
		var crypto = require('crypto');
		var client = crypto.createECDH('secp256k1');
		var client_key = client.generateKeys();//保存客户端公钥,公钥Pku  length=65
		var secret = client.computeSecret(PKs);//共享秘钥,length=32
		var jen = require('./jenkinsHash.js');
		_verifyNum = jen.jenkinsHash(secret);
		//用aes-128-ecb 对用户数据加密
		const cipher = crypto.createCipher('aes-128-ecb', secret);
		var cipherResult = cipher.update(_userData,'hex','hex');//cipher.update(data[, input_encoding][, output_encoding])
		cipherResult += cipher.final('hex');
		_code = 'http://' + _ip + ':'+_port +'?cipherResult='+cipherResult+'&clientKey='+client_key.toString(_encodingMethod);		
	};
	return new Promise(function(resolve,reject){
		/*请求服务器公钥PKs*/
		var req = _http.request(_options,(res) =>{
				res.on('data',(data) => {
					_this.setReturnNum(data);
				});
				res.on('end',() =>{
					resolve({
						code:_code,
						verifyNum:_verifyNum
					});
				});
		});
		req.write(_contents);
		req.end();
	});
};
module.exports = Generator;