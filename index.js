var jsdom = require('jsdom');
var nta = require('concussion-core');
var settings = require('./settings.js');
var connect = require('connect');
var fs = require('fs');
var ejs = require('ejs');
var qs = require('querystring');
var http = require('http');
var util = require('util');
var URLPrefix=process.env.CJS_WEB_URL;
var files2Localize=[{templateFileName:__dirname + "/desktopExample.ejs",outputFileName:__dirname + "/desktopExample.htm"},{templateFileName:__dirname + "/manageLogin.ejs",outputFileName:__dirname + "/js/manageLogin.js"},{templateFileName:__dirname + "/loadEditorContent.ejs",outputFileName:__dirname + "/js/loadEditorContent.js"},{templateFileName:__dirname + "/fileUpload.ejs",outputFileName:__dirname + "/fileUpload.htm"}];
var s = settings();

objects = [];


for(i=0;i<files2Localize.length;i++)
{
	localizeFile(files2Localize[i].templateFileName,files2Localize[i].outputFileName);
}

function localizeFile(fileName,output)
{
	console.log(fileName, " ",output);
	contents = fs.readFileSync(fileName,'utf-8');
	//console.log(contents);
	//contents.replace("@@CJS_WEB_URL@@", process.env.CJS_WEB_URL);
	contentsOutput = ejs.render(contents, {locals: {'CJS_WEB_URL': process.env.CJS_WEB_URL}})
	console.log(contentsOutput);
	fs.writeFile(output,contentsOutput,function(err){
		if(err)
		{
			console.error(err);
		}
		else
			console.log(output + " written successfully");
	});
}

var server = connect.createServer(
	//connect.logger({ format: ':method :url' }),
	connect.cookieParser(),
	connect.session({ secret: 'test'}),
	connect.bodyParser(),
	connect.static(__dirname)
    );

nta.listen(server, s.id);



