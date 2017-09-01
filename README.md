activate-code
	由两部分组成，1.客户端部分，可以产生包含待验证软件信息的字符串（用于生成二维码）和验证码；2、服务器部分，验证使用软件的用户身份，并产生相同的验证码返回给用户。
	操作过程：调用客户端部分，会得到用于生产二维码的字符串、验证码、二维码图片（/activate-code/test/2DCode.svg）、显示图片的HTML文件（/activate-code/test/2wmTest.html），
	用浏览器打开2wmTest.html后用手机扫描二维码，则会得到验证码。通过手机的验证码和客户端得到的验证码相比较便可以确定验证码是否正确。
	身份验证过程采用了对称加密算法ecdh，因此每次使用客户端都会产生不同的二维码字符串，以及用于解密的客户端私钥。使用aes-128对用户数据进行加密，使用jenkinsHash+ecdh生成验证码，来保证低撞码率。
	has two parts : One is the client which can generate a http string for 2d code and an verifying string to activate client software; the other is the server
	which verifying the client auth and generating an code to the user.
	Operation step: Use the client part ,then you get a string(for 2d-code)、verification code、/activate-code/test/2DCode.svg、/activate-code/test/2wmTest.html, open the 2wmTest.html and
	scan the svg with phone, you can get an verification code which can be compared with previous verification code.
activate-code uses ecdh to crypte the input args. So, the output strings are different every time.
The input arguments will be crypted with aes-128 method. The verifying string are generated within jenkinsHash32 
which has low collision. However, the activate-client are used together with the http part which can send verifying  
string to requesting user. And also, communicate its public ecdh key with the server part.

Installation
npm install activate-code
 
Usage
1、开启服务器 node activate-server
2、调用客户端插件，使用方法可参见/test/test.js
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

如果你觉得有帮助的话请留下star
If you think it usefull, please click the star