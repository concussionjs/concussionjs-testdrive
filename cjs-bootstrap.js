/*
*	Library to leverage the power of the concussion platform from anywhere	
*/

//$.getScript("http://testdrive.concussionjs.com/assets/js/libs/jquery-1.7.1.min.js",function(){
$.getScript("http://testdrive.concussionjs.com/assets/js/cjs-utilities.js", function(){
	$.getScript("http://testdrive.concussionjs.com/assets/js/libs/knockout-2.0.0.js", function(){   									

		$(document).ready(function(){
			

			function getPage(callback)
			{
				
				var vars = [], hash;
			    var q = document.URL.split('?')[1];
			    page= {};
			    if(q != undefined){
			        q = q.split('&');
			        for(var i = 0; i < q.length; i++){
			            hash = q[i].split('=');
			            vars.push(hash[1]);
			            vars[hash[0]] = hash[1];
			        }
				}
				//alert(vars["sid"]);
				if(!vars["sid"] && !localStorage.getItem("sessionId"))
				{
					//alert("getUUID");
					getUUID(function(id){
						//
					//alert("inside no cookie " + id);
						//createCookie("sessionId",id,1);
						localStorage.setItem("sessionId",id);
							//alert(localStorage.getItem("sessionId"));
						page.id=localStorage.getItem("sessionId");
						page.html=$('html')[0].innerHTML;
						page.name='index';
						//alert(page.id);	
						callback(page);	
					});
				}
				else
				{
					page.id=localStorage.getItem("sessionId");
						page.html=$('html')[0].innerHTML;
						page.name='index';
						//alert("else ",page.id);	
						callback(page);	
				}
				
				

			}
			//JSON.stringify(document.));
			getPage(function(html)
			{
					$.ajax({
							
							//url: "http://testdrive.shift.com/getMergedJSandHTML/"+sessionId,
            				url: "http://testdrive.concussionjs.com/pages/updateWhere/?id="+localStorage.getItem("sessionId"),
            				data: JSON.stringify(html),
            				//crossDomain:true,
            				//cache:false,
            				type: "post", 
            				success: function(result) 
							{ 
								//alert(result);
								$.getScript("http://testdrive.concussionjs.com/getScript?id="+localStorage.getItem("sessionId")+"&pagename=index", function(){
   									//alert("Script loaded and executed.");
   									// here you can use anything you defined in the loaded script
								});
								$("body").append("<a href=\"#\" onclick=\"window.open(\'http://testdrive.concussionjs.com/admin?id=" + localStorage.getItem("sessionId") + "\');\"> admin </a>");
								//$("#preview").attr({"src":"http://testdrive.concussionjs.com/getPage?id="+ myId + "&pagename=index"});
							}
        			});
        	});
		});
	});
});
//});
