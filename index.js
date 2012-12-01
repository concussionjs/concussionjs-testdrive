var jsdom = require('jsdom');
var nta = require('./node_modules/nextera/nextera.js');
var settings = require('./settings.js');
var connect = require('connect');
var fs = require('fs');
var html = fs.readFileSync('kotemplate.ejs', 'utf-8');
var scriptonly = fs.readFileSync('kotemplate-scriptonly.ejs', 'utf-8');
var ejs = require('ejs');
var qs = require('querystring');
var http = require('http');
var parse = require('./inferObjects.js');
var util = require('util');
var s = settings();

objects = [];

function escapeSpecialCharacters(text)
{
  //console.log(text);
		text = '' + text;
  text = text.replace('[', '\\[', 'g');
  text = text.replace('\\', '\\\\', 'g');
  text = text.replace('^', '\\^', 'g');
  text = text.replace('$', '\\$', 'g');
  text = text.replace('.', '\\.', 'g');
  text = text.replace('|', '\\|', 'g');
  text = text.replace('?', '\\?', 'g');
  text = text.replace('*', '\\*', 'g');
  text = text.replace('+', '\+', 'g');
  text = text.replace('(', '\\(', 'g');
  text = text.replace(')', '\\)', 'g');
  //console.log(text);
  return text;
}

addNewObjects = function(objects,callback)
    {
	if (nta.debug)
		util.debug('addNewObjects: inside addNewObjects', objects.length);
	for (i = 0; i < objects.length; i++)
	{
		if (nta.debug)
			util.debug('addNewObjects: ', objects[i].name);
		try {
		var currentObj = objects[i];
		var currentName = '' + currentObj.name;
		if (nta.debug)
			util.debug('addNewObjects: currentName', currentName, ' ', currentObj.fields.length, JSON.stringify(currentObj));
		if (currentName.search('_search') < 0)
		{
		nta.getEntriesWhere({'name': currentName},'nextera_objects', function(err,result)
		{
			//console.log("addNewObjects,","inside find ", "result: ", result.length, ", ", currentObj.name);
			if (nta.debug)
				util.debug('addNewObjects: inside getEntriesWhere');
			if (err)
			{
				console.error('Error when getting entries in addNewObjects, err:', err);
				return;
			}

			if (result.length > 0)
			{
				currentObj.fields = dedupe(result[0].fields.concat(currentObj.fields));
				nta.updateEntry('' + result[0]._id, {$set: currentObj},'nextera_objects', function(err) {
						if (err)
						{
							console.error('addNewObjects err: ', err);
						}
				});
				return;
			}
			else
			{
				if (nta.debug)
					util.debug('addNewObjects: object does not exist');
				nta.createEntry(currentObj, 'nextera_objects', function(msg) {
						if (nta.debug)
							util.debug('add new ', msg);
						callback();
				});
			}

		});
		if (nta.debug)
			util.debug('addNewObjects: i: ', i, ' objects.length: ', objects.length);

		if (i == objects.length - 1)
			callback();
	}
		}catch (e) {console.error('addNewObjects:big error', e);}
	}

};

var generateRoutes = function(req,res,next) {
	skipNext = false;

	if (nta.debug)
		util.debug('req.url: generateroutes: ', req.url, req.rawBody);

	nta.getEntries('nextera_objects', function(err,result) {
		if (err)
		{
			res.end(err);
			console.error('getEntries err: ', err);
			return;
		}
		///console.log("objects: ", JSON.stringify(result));
		loopThroughObjects(result, req, res, next);
	});
};

function setSessionId(myObjects,sessionId,i,callback)
{

	if (i < myObjects.length)
	{
		myObjects[i].tenant_id= sessionId;
		myObjects[i].name = sessionId + '_' + myObjects[i].name;
		setSessionId(myObjects, sessionId, i + 1, callback);
	}
	else
	{
		if (nta.debug)
			util.debug('getPage: ', i);
		callback(myObjects);
	}
}

loopThroughObjects = function(objects,req,res,next)
    {
	if (req.url.search('/nextera_objects_models') > -1)
	{

		if (req.url.split('/').length < 2)
		{
			return;
		}

    var newObject = {};
    var searchTerm = '';
    if (req.url.search('.com') > -1)
    {
	    	searchTerm = req.url.split('.com')[1].split('/')[2].split('?')[0];
		}
	    else
	    {
	    	searchTerm = req.url.split('/')[2].split('?')[0];
	    	if (nta.debug)
				util.debug('searchTerm: 3', searchTerm);
	    }

	    if (nta.debug)
			util.debug('searchTerm: ', searchTerm, req.url);
		nta.getEntriesWhere({'name': searchTerm},'nextera_objects', function(err,result) {
				if (err)
				{
					res.end(err);
					console.error('getEntriesWhere err: ', err);
					return;
				}
				res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'application/json'});
				res.end(JSON.stringify(result));
		});
		return;
	}
	//console.log("updatePage: url",req.url);

	for (counter = 0; counter < objects.length; counter++)
	{
		//console.log("inside loop: ", counter , " /", objects[counter].name, " ", req.url.split("?")[0].split(".com")[1] );
		if (req.url.split('?')[0].split('.com')[1] == '/' + objects[counter].name
			||
			req.url.split('?')[0] == '/' + objects[counter].name)
		{
			nta.getEntries(objects[counter].name, function(err,documents) {
				res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'application/json'});
				res.end('' + JSON.stringify(documents));
			});
			skipNext = true;
			return;
		}
		else if (req.url.search('/getUUID') > -1)
		{
			res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
			nta.createEntry({expiration_date: new Date(), test: 444},'sessions', function(msg,obj) {
				if (nta.debug)
					util.debug(JSON.stringify(obj));
				res.end('' + obj[0]._id);
			});
			return;
		}
		else if (req.url.search('/getMergedJSandHTML') > -1)
		{
			var searchKey = [];
			var object = {};
			//console.log(req.rawBody);
			var sessionId = req.url.split('/')[req.url.split('/').length - 1];

				if (nta.debug)
					util.debug('session id: ', sessionId);
				parse.runGenerateStructureHTML(req.rawBody, function(myObjects) {
					//objects = objects.concat(myObjects);
					var myName = myObjects[0].name;
					//myObjects[0].name=sessionId+"_"+myObjects[0].name;
					setSessionId(myObjects, sessionId, 0, function(myObjects) {
						if (nta.debug)
							util.debug(sessionId, ' ', JSON.stringify(myObjects));
						addNewObjects(myObjects, function() {
							if (nta.debug)
								util.debug(JSON.stringify(myObjects));
							//ejs.render(html,{locals:{myObjects:myObjects}})
							var mergedJSandHTML = ('' + req.rawBody).split(myName).join(myObjects[0].name);
							res.write(mergedJSandHTML);
							//res.write(koScript);
							//console.log(myObjects[0].name," ",(""+req.rawBody).replace(myObjects[0].name,sessionId+"_"+myObjects[0].name));
							res.end();
							fs.writeFileSync(sessionId + '.html', mergedJSandHTML, 'utf-8');
						});
					});
				});
      return;
		}
		else if (req.url.search('/getPage') > -1)
		{
			var searchKey = [];
			var object = {};
			res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
			if (nta.debug)
				util.debug('querystring: ', req.url.split('?').length);
			var args = qs.parse(req.url.split('?')[1]);
			var id = args.id;
			var pagename = args.pagename;
			if (nta.debug)
				util.debug('getPage: session id: ', id, ' ', pagename);

			nta.getEntriesWhere({'id': id, 'name': pagename},'pages', function(err,objects) {
				if (nta.debug)
					util.debug('why double:, number of matching pages ', objects.length);
				if (objects && objects.length > 0 && objects[0].html)
				{
					parse.runGenerateStructureHTML(objects[0].html, function(myObjects) {
						if (nta.debug)
							util.debug('why double:, number of objects parsed', myObjects.length);
						var myName = myObjects[0].name;
						setSessionId(myObjects, 'id_' + id, 0, function(myObjects) {
							if (nta.debug)
							{
								util.debug(id, ' ', JSON.stringify(myObjects));
								util.debug(objects[0].html);
								util.debug('getPage: setSessionId');
							}
							addNewObjects(myObjects, function() {
								if (nta.debug)
								{
									util.debug('getPage: addNewObjects');
									util.debug(JSON.stringify(myObjects));
								}
								var myregexp2 = new RegExp(': *' + myName, 'ig');
								var mergedJSandHTML = '' + objects[0].html;
								for (i = 0; i < myObjects.length; i++)
								{
									mergedJSandHTML = mergedJSandHTML.replace(myregexp2, ':' + myObjects[i].name);
								}

								if (nta.debug)
									util.debug('getPage: ', mergedJSandHTML);
								res.write(ejs.render(html, {locals: {'myObjects': dedupe(myObjects)}}));
								res.end(mergedJSandHTML);
							});
						});
					});
				}
			});

      return;
		}
		else if (req.url.search('/getScript') > -1)
		{
			var searchKey = [];
			var object = {};
			res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/javascript'});
			//console.log(req.rawBody);
			var args = qs.parse(req.url.split('?')[1]);
			var id = args.id;
			var pagename = args.pagename;
			if (nta.debug)
				util.debug('getScript: session id: ', id, ' ', pagename);

			nta.getEntriesWhere({'id': id, 'name': pagename},'pages', function(err,objects) {
				if (nta.debug)
					util.debug('getScript: ', JSON.stringify(objects));
				if (objects && objects.length > 0 && objects[0].html)
				{
					parse.runGenerateStructureHTML(objects[0].html, function(myObjects) {
						var myName = myObjects[0].name;
						setSessionId(myObjects, 'id_' + id, 0, function(myObjects) {
							if (nta.debug)
							{
								util.debug('getScript: setSession', id, ' ', JSON.stringify(myObjects));
								util.debug('getScript: ', objects[0].html);
								util.debug('getScript: setSessionId');
							}
							addNewObjects(myObjects, function() {
								if (nta.debug)
								{
									util.debug('getScript: addNewObjects');
									util.debug('getScript: ', JSON.stringify(myObjects));
								}
								//var mergedJSandHTML = (""+objects[0].html).split(myName).join(myObjects[0].name);
								//console.log("getPage: ",mergedJSandHTML);
								//res.writeHeader(200,{'Access-Control-Allow-Origin':'*'});
								res.end(ejs.render(scriptonly, {locals: {'myObjects': dedupe(myObjects)}}));
								//res.end(mergedJSandHTML);
							});
						});
					});
				}
			});


      return;
		}
		else if (req.url.search('/' + objects[counter].name + '/create') > -1)
    {
				var searchKey = [];
				var object = {};
				if(req.url.split("/create/").length>1)

				if (nta.debug)
					util.debug('create: rawBody: ', req.rawBody);
				res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'application/json'});
				setupObject(searchKey, 0, objects, counter, req, object, function(newObject) {
					nta.createEntry(newObject, objects[counter].name, function(msg) {
						res.end(msg);
					});
            	});
      return;
    }
    else if (req.url.search('/' + objects[counter].name + '/instanceCreate') > -1)
    {
				var searchKey = [];
				var object = {};
				
				if (nta.debug)
					util.debug('create: rawBody: ', req.rawBody);
				res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'application/json'});
				setupObject(searchKey, 0, objects, counter, req, object, function(newObject) {
					newObject.tenant_object_id = objects[counter].name;
					nta.createEntry(newObject, "instances", function(msg) {
						res.end(msg);
					});
            	});
      return;
    }
	else if (req.url.search('/' + objects[counter].name + '/search') > -1)
    {
			if (req.url.split('/').length < 3)
			{
				return;
			}
			res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
	        var searchTerm = req.url.split('/')[3];
      nta.searchEntries(searchTerm, objects[counter].name, function(err,documents) {
				res.end(JSON.stringify(documents));
      });
			return;
    }
    else if (req.url.search('/' + objects[counter].name + '/getEntryWhere/') > -1)
    {
		var where = qs.parse(req.url.split('?')[1]);
		if (nta.debug)
			util.debug(JSON.stringify(where));
		res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
		nta.getEntryWhere(where, objects[counter].name, function(err,documents) {
			//console.log(documents.length);
			res.end(JSON.stringify(documents[0]));
      	});
			return;
    }
    else if (req.url.search('/' + objects[counter].name + '/getEntriesByName/') > -1)
    {
		var args = qs.parse(req.url.split('?')[1]);
		var where = args.where;
		res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
		nta.getEntriesByName(where, objects[counter].name, function(err,documents) {
        	//console.log(documents.length);
			res.end(JSON.stringify(documents));
		});
		
		return;
    }
	else if (req.url.search('/' + objects[counter].name + '/getEntriesByTenantObjectId/') > -1)
    {
		var args = qs.parse(req.url.split('?')[1]);
		var where = args.where;
	       
		res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
    	nta.getEntriesByTenantObjectId(where, "instances", function(err,documents) {
            	//console.log(documents.length);
				res.end(JSON.stringify(documents));
		});
		return;
    }
	else if (req.url.search('/' + objects[counter].name + '/delete') > -1)
    {
		res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'application/json'});
		if (req.url.split('/').length < 3)
		{
			//console.log("no search term provided");
			return;
		}
		if (req.url.search('.com') > -1)
		{
			var objectId = req.url.split('.com')[1].split('/')[3].split('?')[0];
		}
		else
		{
        	var objectId = req.url.split('/')[3].split('?')[0];
		}
        
        nta.deleteEntry(objectId, objects[counter].name, function(err,documents) {
        	if (err)
        	{
        		res.end('failure');
        	}
        	else
        	{
	    		res.end('success');
	   		}
        });

		return;
    }

	else if (req.url.search('/' + objects[counter].name + '/update/') > -1)
    {
    	if (nta.debug)
			util.debug('updatePage: ', req.rawBody);
		res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
      	if (req.url.split('/').length < 3)
      	{
      		//console.log("no search term provided");
        	return;
      	}

      	updatedRow = JSON.parse(('' + req.rawBody).replace('_id', '_id_mock'));
      	var oId;

      	if (req.url.search('.com') > -1)
        {
        	var oId = req.url.split('.com')[1].split('/')[3].split('?')[0];
		}
        else
        {
        	var oId = req.url.split('/')[3].split('?')[0];
        }

		if (nta.debug)
			util.debug('oId: ', oId);
		
		searchKey = [];
		for (j = 0; j < objects[counter].fields.length; j++)
		{
			searchKey.push(eval('updatedRow.' + objects[counter].fields[j].name));
		}

      	updatedRow._search_keys = searchKey;

		try {
        	nta.updateEntry(oId, updatedRow, objects[counter].name, function(err,documents) {
            	if (err)
            	{
            		res.end('failure');
				}
				else
				{
					res.end('success');
				}
			});
		}catch (e) {console.error('err:', e);}

		return;
    }
	else if (req.url.search('/' + objects[counter].name + '/instanceUpdate/') > -1)
    {
        if (nta.debug)
			util.debug('updatePage: ', req.rawBody);
        res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With', 'Access-Control-Allow-Headers': 'application/json'});
      	if (req.url.split('/').length < 3)
      	{
        	//console.log("no search term provided");
        	return;
      	}

      	updatedRow = JSON.parse(('' + req.rawBody).replace('_id', '_id_mock'));
      	updatedRow.tenant_object_id = objects[counter].name;
      	
      	var oId;

      	if (req.url.search('.com') > -1)
        {
        	var oId = req.url.split('.com')[1].split('/')[3].split('?')[0];
        }
        else
        {
        	var oId = req.url.split('/')[3].split('?')[0];
        }


      	if (nta.debug)
			util.debug('oId: ', oId);
      	searchKey = [];
    	for (j = 0; j < objects[counter].fields.length; j++)
	  	{
			searchKey.push(eval('updatedRow.' + objects[counter].fields[j].name));
		}

      	updatedRow._search_keys = searchKey;

      	try {
        	nta.updateEntry(oId, updatedRow, "instances", function(err,documents) {
        		if (err)
            	{
            		res.end('failure');
            	}
            	else
            	{
            		res.end('success');
            	}
            });
		}catch (e) {console.error('err:', e);}
		
		return;
    }
    else if (req.url.search('/' + objects[counter].name + '/updateWhere/?') > -1)
    {
		if (nta.debug)
			util.debug('updatePage:x ', req.rawBody, ' url', req.url);
		res.writeHeader(200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'application/json'});
		if (req.url.split('/').length < 3)
		{
			//console.log("no search term provided");
			return;
		}

		updatedRow = JSON.parse(('' + req.rawBody).replace('_id', '_id_mock'));

		var where = qs.parse(req.url.split('?')[1]);

		if (nta.debug)
			util.debug('updatePage: where: ', JSON.stringify(where));
		
		searchKey = [];
		for (j = 0; j < objects[counter].fields.length; j++)
		{
			searchKey.push(eval('updatedRow.' + objects[counter].fields[j].name));
		}

		updatedRow._search_keys = searchKey;

      	try {
        	nta.updateEntryWhere(where, updatedRow, objects[counter].name, function(err,documents) {
				if (err)
				{
					res.end('failure');
				}
				else
				{
					res.end('success');
				}
			});
		}catch (e) {console.error('err:', e);}
		return;
    }
	}
		next();
};

var setupObject = function(searchKey,fieldIndex,objects,counter,req,newObject,callback)
    {
	var j = fieldIndex;
	if (nta.debug)
		util.debug('create: rawBody: ', req.rawBody);
	
	if (fieldIndex == objects[counter].fields.length)
	{
		try {
			//console.log("create: searchKey: ",searchKey);
			//newObject._search_keys=searchKey;
			callback(newObject);
		}catch (e) {console.log('create: ', e);}
		return;
	}
	else if (fieldIndex < objects[counter].fields.length)
	{
		if (req.rawBody != '')
			var text = 'newObject.' + objects[counter].fields[j].name + ' = JSON.parse(req.rawBody).' + objects[counter].name + '_' + objects[counter].fields[j].name;
		else
			var text = 'newObject.' + objects[counter].fields[j].name + " = ''";
		if (nta.debug)
			util.debug('create: rawBody: ', req.rawBody);
		if (nta.debug)
			util.debug('create: text: ', text);

		eval(text);
		//console.log("create: eval",eval("newObject." + objects[counter].fields[j].name));

		if (nta.debug)
			util.debug('create: newObject: ', JSON.stringify(newObject));
		searchKey.push(eval('newObject.' + objects[counter].fields[j].varname));
		newObject._search_keys = searchKey;
		setupObject(searchKey, fieldIndex + 1, objects, counter, req, newObject, callback);
	}
};

var extractObj=function(name)
{
	var arr = name.split("_");
	if(arr[0]=="id" && arr.length>2)
		return {id:arr[1],obj_name: arr[2]};
	else
		return null;
}

var dedupe = function(arr)
    {
	var arrTrackDupes = [];
	var retArr = [];
	for (i = 0; i < arr.length; i++)
	{
		//console.log("testParse: ",arr[i].name, " ",retArr.length, " ",arrTrackDupes.indexOf(arr[i].name));
		if (arrTrackDupes.indexOf(arr[i].name) == -1)
		{
			arrTrackDupes[arrTrackDupes.length] = arr[i].name;
			retArr[retArr.length] = arr[i];
		}
	}

	return retArr;
};

fs.watchFile('index.html', function(curr,prev) {

  if (curr.mtime == prev.mtime) {
  //console.log("WatchFile mtime equal");
  } else {
    //console.log("WatchFile mtime not equal");
    objects = [];
    try {
      parse.runGenerateStructureHTML(fs.readFileSync('index.html').toString(), function(myObjects) {
			var newObject = {};//myObject();
			for (i = 0; i < myObjects.length; i++)
			{
				//console.log("WatchFile: objectname x", myObjects[i].name.trim(), "x ",myObjects[i].fields.length);
				var currentName = '' + myObjects[i].name;
				var currentFields = myObjects[i].fields;
				if (myObjects[i].name.search('_search') < 0)
				{
				//console.log("WatchFile: name again ",currentName)
				nta.getEntriesWhere({name: currentName},'nextera_objects', function(err,result) {
					if (err)
					{
						console.error('WatchFile err: ', err);
						res.end(err);
						return;
					}
					//console.log("WatchFile: ",JSON.stringify(result));
					if (result.length > 0)
					{
						//console.log("WatchFile: testParse: update before",currentName, " ",JSON.stringify(currentFields), " result:", JSON.stringify(result[0].fields));
						try {
							result[0].fields = dedupe(result[0].fields.concat(currentFields));
						}catch (e) {console.log('testParse: ' + e);}
						// console.log("WatchFile: testParse: update after",currentName, " ",JSON.stringify(result[0].fields));
						nta.updateEntry('' + result[0]._id, {$set: {fields: result[0].fields}},'nextera_objects', function(err,result)
						{
							if (err)
							{
								//console.log('WatchFile err testParse: ',err);
								return;
							}

							//console.log("WatchFile: testParse: updated object ",currentName);

								//generateSchema(function(){console.log("gen structure: ",mySchema)});
						});
						objects = result;
					}
					/*else if(!myObjects[i])
					{
						console.log("Watchfile myObjects[i] was undefined");
						return;
					}*/
					else
					{
						newObject.name = currentName;
						newObject.fields = currentFields;//myObjects[i].fields;
						nta.createEntry(newObject, 'nextera_objects', function(err,docs) {
							if (err)
							{
								console.error('WatchFile err: ', err);
								return;
							}

							//console.log("WatchFile: added object ",currentName);
							nta.getEntries('nextera_objects', function(err,result) {
								if (err)
								{
									console.error('gen structure: ,err: ', err);
									res.end(err);
									return;
								}

								objects = result;
							});
						});
					}
				});
			}
			}
		});
		}catch (e) {console.error('WatchFile: testParse:', e);}
	}
});

var server = connect.createServer(
	//connect.logger({ format: ':method :url' }),
	connect.cookieParser(),
	connect.session({ secret: 'test'}),
	connect.bodyParser(),
	generateRoutes,
	nta.serveStaticFilesNoWriteHead//,
	//connect.static(__dirname)
    );

nta.listen(server, s.id);



