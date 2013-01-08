		var myId="";
		var editor;
		 (function(d){
 		    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
 		    if (d.getElementById(id)) {return;}
 		    js = d.createElement('script'); js.id = id; js.async = true;
 		    js.src = "//connect.facebook.net/en_US/all.js";
 		    ref.parentNode.insertBefore(js, ref);
 		  }(document));

 		window.fbAsyncInit = function() {
 		   FB.init({
		 	 appId      : '231629423618271', // App ID
 		     //channelUrl : 'http://concussionjs.COM/channel.html', // Channel File
 		     status     : true, // check login status
 		     cookie     : true, // enable cookies to allow the server to access the session
 		     xfbml      : true  // parse XFBML
 		   });
		
 		   // Additional initialization code here

 		 // Load the SDK Asynchronously
 		

 		    // listen for and handle auth.statusChange events
        FB.Event.subscribe('auth.statusChange', function(response) {
        	//alert(JSON.stringify(response));
          if (response.authResponse) {
            // user has auth'd your app and is logged into Facebook
            FB.api('/me', function(me){
         		//alert(JSON.stringify(me));
				myId = me.id;
				//alert(myId);
				if (me.name) {
					document.getElementById('auth-displayname').innerHTML = me.name;
				}
				createCookie("sessionId",myId,1);
				getPage(myId,"index",submitFormData);
				synchSessionVariables(myId);
            })
            document.getElementById('auth-loggedout').style.display = 'none';
            document.getElementById('auth-loggedin').style.display = 'block';
          } else {
            // user has not auth'd your app, or is not logged into Facebook
            document.getElementById('auth-loggedout').style.display = 'block';
            document.getElementById('auth-loggedin').style.display = 'none';
          }
        });

        // respond to clicks on the login and logout links
        $('#masthead-icon-facebook').click(function(){FB.login();});
        $('#auth-logoutlink').click(function(){FB.logout();}); 
      } 

		
		$(document).ready(function(){
			//justDoIt=$(".justDoItContent");
			aceEditorInit($(".editor"));
			aceEditorInit($(".snippet"));
			myId=readCookie("sessionId");
			$(".justDoIt").click(justDoItForMe);
			$(".continue").click(justSubmit);
			//$("#addedBinds").click(addThreeContactRecords);

			/*editor = ace.edit("editor");
			editor.setTheme("ace/theme/concussion");
			editor.getSession().setMode("ace/mode/html");
			editor.setShowPrintMargin(false);*/
			if(!readCookie("sessionId"))
			{
				//alert("inside no cookie");
				createUUID(function(uuid)
				{
					createCookie("sessionId",uuid,1);
					synchSessionVariables(uuid);
				});
			}

			if(!myId)
			{	
				console.log("No authenticated user or session");
				editor.getSession().setValue("");
				submitFormData(readCookie("sessionId"));
			}
			else
			{
				console.log("myId:", myId);
				getPage(myId,"index",submitFormData);
			}

			$("#panel-header-icon-refresh").click(function(event){
					//alert("clicked");
					submitFormData();
			});	
		});

function justSubmit()
{
	console.log("justSubmit()");
	_gaq.push(['_trackEvent', 'TutorialAction', 'JustSubmit', readCookie("sessionId")]);
	
	/*if(this.getAttribute("data-addContacts")=="true")
	{
		addThreeContactRecords();
	}*/
	submitFormData();
}

function justDoItForMe()
{
	_gaq.push(['_trackEvent', 'TutorialAction', 'JustDoItForME', readCookie("sessionId")]);
	editor.getSession().setValue(justDoIt[this.getAttribute("data-index")]);

	submitFormData();

}

function addThreeContactRecords()
{
	addSampleRecords(3,"contacts",readCookie("sessionId"));
}

function addSampleRecords(number,type,id)
{	
	for(i=0;i<number;i++)
	{
		var objectId="id_" + id + "_" + type;
		var nameVar = objectId + "_name";
		var emailVar = objectId + "_email";
		var phoneVar = objectId + "_phone";
		var nameVal = "name" + i;
		var emailVal = "email" + i;
		var phoneVal = "phone" + i;
		contact = "{\"" + nameVar + "\":\"" + nameVal + "\",\"" + emailVar + "\":\"" + emailVal + "\",\"" + phoneVar + "\":\"" + phoneVal + "\"}";

		$.ajax("http://api.local-concussionjs.com/createInstance/" + objectId, {
            data: contact,
            type: "POST",
            success: function(result) 
			{ 
					console.log("record successfully added record " + i);	
			}
        });
	}
}

function aceEditorInit(editors)
{
	console.log(editors.length);
	for(i=0;i<editors.length;i++)
	{
		console.log(editors[i].id + " "+ editors[i].getAttribute("data-readonly"));
		eval(editors[i].id + "=ace.edit(\"" + editors[i].id + "\");");
		eval(editors[i].id + ".setTheme(\"ace/theme/concussion\");");
		eval(editors[i].id + ".getSession().setMode(\"ace/mode/html\");");
		eval(editors[i].id + ".setShowPrintMargin(false);");
		eval(editors[i].id + ".setReadOnly(" + editors[i].getAttribute("data-readonly") + ");");
		eval(editors[i].id + ".renderer.setShowGutter(" + editors[i].getAttribute("data-gutter") + ");");
		//eval(editors[i].id + ".resize();");
	}
}
function getPage(userId,filename,callback)
{
	synchSessionVariables(userId);
	$.ajax({
		//url: "http://testdrive.shift.com/getMergedJSandHTML/"+sessionId,
         url: "http://api.local-concussionjs.com/getEntryWhere/pages?id="+userId+"&name="+filename,
         type: "get", 
         dataType:"text",
         success: function(result) 
		{ 
			var obj = JSON.parse(result)
			//alert(""+obj.html);
			editor.getSession().setValue(obj.html);
			editor.resize();
			if(callback)
				callback();
		}
   	});
}

	function synchSessionVariables(id)
	{
		$("#synchSessionVariables").attr({"src":"http://api.local-concussionjs.com/setSessionVariables.html?sid="+ id});
	}

	function submitFormData(id)
	{
		//alert($("#codeArea").attr("value"));
		//alert(editor.getSession().getValue());
		var page={};
		if(id)
		{
			myId = id;
		}
		page.id = myId;
		page.html = editor.getSession().getValue();
		page.name="index"
		//alert(JSON.stringify(page));
		$.ajax({
			//url: "http://testdrive.shift.com/getMergedJSandHTML/"+sessionId,
        	url: "http://api.local-concussionjs.com/updateWhere/pages?id="+myId,
        	data: JSON.stringify(page),//$("#codeArea").value,
    		type: "post", 
    		success: function(result) 
			{	 
				//alert(result);
				$("#preview").attr({"src":"http://api.local-concussionjs.com/getPage/"+ myId + "/index"});
				$("#admin-app").attr({"src":"http://api.local-concussionjs.com/admin.html?id="+ myId});
				synchSessionVariables(myId);
			}
		});
	}

	function openUpPreviewWindow()
	{
		window.open("http://api.local-concussionjs.com/getpage/"+ myId + "/index");
	}