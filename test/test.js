var Generator = require('../Generator');
var qr = require('qr-image');
var generator = new Generator({
	ip:"10.10.10.217",
	port:"8888",
	userId:"10001",
	softwareId:"12",
	softwareVersion:"11"
}).then(function(data){
		console.log(data.code);// 返回用于生成验证码的字符串
		console.log(data.verifyNum);// 验证码
		var qr_svg = qr.image(data.code, { type: 'svg' });
		qr_svg.pipe(require('fs').createWriteStream('2DCode.svg'));
		var svg_string = qr.imageSync(data.code, { type: 'svg' });
	});
/*
*
ip;//服务器IP
port;//服务器端口
userId);//用户编号 < 4294967296
softwareId);//待激活软件编号 < 65536
softwareVersion);//待激活软件版本号 < 65536

* */