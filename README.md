activate-code
	����������ɣ�1.�ͻ��˲��֣����Բ�����������֤�����Ϣ���ַ������������ɶ�ά�룩����֤�룻2�����������֣���֤ʹ��������û���ݣ���������ͬ����֤�뷵�ظ��û���
	�������̣����ÿͻ��˲��֣���õ�����������ά����ַ�������֤�롢��ά��ͼƬ��/activate-code/test/2DCode.svg������ʾͼƬ��HTML�ļ���/activate-code/test/2wmTest.html����
	���������2wmTest.html�����ֻ�ɨ���ά�룬���õ���֤�롣ͨ���ֻ�����֤��Ϳͻ��˵õ�����֤����Ƚϱ����ȷ����֤���Ƿ���ȷ��
	�����֤���̲����˶ԳƼ����㷨ecdh�����ÿ��ʹ�ÿͻ��˶��������ͬ�Ķ�ά���ַ������Լ����ڽ��ܵĿͻ���˽Կ��ʹ��aes-128���û����ݽ��м��ܣ�ʹ��jenkinsHash+ecdh������֤�룬����֤��ײ���ʡ�
	has two parts : One is the client which can generate a http string for 2d code and an verifying string to activate client software; the other is the server
	which verifying the client auth and generating an code to the user.
	Operation step: Use the client part ,then you get a string(for 2d-code)��verification code��/activate-code/test/2DCode.svg��/activate-code/test/2wmTest.html, open the 2wmTest.html and
	scan the svg with phone, you can get an verification code which can be compared with previous verification code.
activate-code uses ecdh to crypte the input args. So, the output strings are different every time.
The input arguments will be crypted with aes-128 method. The verifying string are generated within jenkinsHash32 
which has low collision. However, the activate-client are used together with the http part which can send verifying  
string to requesting user. And also, communicate its public ecdh key with the server part.

Installation
npm install activate-code
 
Usage
1������������ node activate-server
2�����ÿͻ��˲����ʹ�÷����ɲμ�/test/test.js
var qr = require('qr-image');
var Generator = require('../Generator');
var generator = new Generator({
	ip:"127.0.0.1",/*server ip*/
	port:"8888",/*server port*/
	userId:"10001", /*the user for the activating software, should be < 4294967296*/
	softwareId:"12",/*the software id which needs to be activated, should be < 65536*/
	softwareVersion:"11"/*the software version which needs to be activated, should be < 65536*/
}).then(function(data){
		console.log(data.code);
		console.log(data.verifyNum);
		var qr_svg = qr.image(data.code, { type: 'svg' });
        qr_svg.pipe(require('fs').createWriteStream('2DCode.svg'));
        var svg_string = qr.imageSync(data.code, { type: 'svg' });
	});

���������а����Ļ�������star
If you think it usefull, please click the star