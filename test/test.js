var Generator = require('../Generator');
var qr = require('qr-image');
var generator = new Generator({
	ip:"10.10.10.217",
	port:"8888",
	userId:"10001",
	softwareId:"12",
	softwareVersion:"11"
}).then(function(data){
		console.log(data.code);// ��������������֤����ַ���
		console.log(data.verifyNum);// ��֤��
		var qr_svg = qr.image(data.code, { type: 'svg' });
		qr_svg.pipe(require('fs').createWriteStream('2DCode.svg'));
		var svg_string = qr.imageSync(data.code, { type: 'svg' });
	});
/*
*
ip;//������IP
port;//�������˿�
userId);//�û���� < 4294967296
softwareId);//������������ < 65536
softwareVersion);//����������汾�� < 65536

* */