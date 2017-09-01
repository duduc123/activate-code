var crypto = require('crypto');
var serverEcdh;
var serverEcdh_pubKey;
var encodingMethod = 'hex';
var userInfo;

generateKey();
function generateKey(){
	serverEcdh = crypto.createECDH('secp256k1');//secp256k1   65位,secp521r1  133位
    serverEcdh_pubKey = serverEcdh.generateKeys();
}

var http = require('http');
var url = require('url');
var server = http.createServer(function(req,res){
	res.writeHeader(200,{'Content-Type':'text/plain;charser=utf-8'});
	var urlname = url.parse(req.url);
	var userData=[];
	var decrypted;
	console.log(urlname.pathname);
	switch(urlname.pathname){
		case ''||'/':// 模拟欢迎页,nodejs是高效流处理的方案,也可以通过配置文件来配置
		console.log('请求验证码');
		var arg = url.parse(req.url,true).query;
        var cipherResult = arg.cipherResult; 
		console.log('cipherResult:');
		console.log(cipherResult);
	    var clientKey = new Buffer(arg.clientKey,encodingMethod); 
		var algorithm = 'aes-128-ecb';
		var secret = serverEcdh.computeSecret(clientKey);//共享秘钥
		var decipher = crypto.createDecipher('aes-128-ecb', secret);
		decrypted = decipher.update(cipherResult,'hex','hex');
		decrypted += decipher.final('hex');//用户信息
		var userStr = decrypted.toString();
		console.log('userStr: ' +userStr);
		var userbuffer = new Buffer(userStr,'hex');
		var c_protocalId = userbuffer.readUIntBE(0,1);
		var c_protocalVersion = userbuffer.readUIntBE(1,1);
		var c_userId = userbuffer.readUIntBE(2,4);
		var c_softwareId = userbuffer.readUIntBE(6,2);
		var c_softwareVersion = userbuffer.readUIntBE(8,2);
		var c_timeStamp = userbuffer.readUIntBE(10,6);
		console.log("userInfo : "+c_protocalId + c_protocalVersion + c_userId + c_softwareId + c_softwareVersion + c_timeStamp);
		var jen = require('./jenkinsHash.js');
		var verifyNum = jen.jenkinsHash(secret);
		console.log("verifynum : " +verifyNum);
		res.write(verifyNum);
		break;
		case '/key':
		res.write(serverEcdh_pubKey);
		console.log('请求服务器公钥');
		break;
		
		case '/user':
		res.write('a1b2c45d');
		console.log('请求用户信息')
		break;
	}
	
	
	res.end();
});
server.listen(8888);
console.log("http server runnint on port 8888......");
//解密
function deciphy(cipherResult,clientKey){
	var algorithm = 'aes-128-ecb';
	var secret = serverEcdh.computeSecret(clientKey);//共享秘钥
	var decipher = crypto.createDecipher('aes-128-ecb', secret); 
	return decrypted;
}