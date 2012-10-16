/*
	Library to leverage the power of the concussion platform from anywhere
	
*/

//$.getScript("http://testdrive.concussionjs.com/assets/js/libs/jquery-1.7.1.min.js",function(){
$.getScript("http://testdrive.concussionjs.com/assets/js/cjs-utilities.js", function(){
	$.getScript("http://testdrive.concussionjs.com/assets/js/libs/knockout-2.0.0.js", function(){   									

		$(document).ready(function(){
			

			function getPage()
			{
				
				var vars = [], hash;
			    var q = document.URL.split('?')[1];
			    if(q != undefined){
			        q = q.split('&');
			        for(var i = 0; i < q.length; i++){
			            hash = q[i].split('=');
			            vars.push(hash[1]);
			            vars[hash[0]] = hash[1];
			        }
				}
				//alert(vars["sid"]);
				if(!vars["sid"] && !readCookie("sessionId"))
				{
					//alert("getUUID");
					getUUID(function(id){
						//
						alert("inside no cookie " + id);
						createCookie("sessionId",id,1);
						alert(readCookie("sessionId"));
					});
				}
				page= {};
				page.id=readCookie("sessionId");
				page.html=$('html')[0].innerHTML;
				page.name='index';			
				return page;
			}
			//JSON.stringify(document.));
			$.ajax({
							
							//url: "http://testdrive.shift.com/getMergedJSandHTML/"+sessionId,
            				url: "http://testdrive.concussionjs.com/pages/updateWhere/?id="+readCookie("sessionId"),
            				data: JSON.stringify(getPage()),
            				crossDomain:true,
            				cache:false,
            				type: "post", 
            				success: function(result) 
							{ 
								//alert(result);
								$.getScript("http://testdrive.concussionjs.com/getScript?id="+readCookie("sessionId")+"&pagename=index", function(){
   									//alert("Script loaded and executed.");
   									// here you can use anything you defined in the loaded script
								});

								//$("#preview").attr({"src":"http://testdrive.concussionjs.com/getPage?id="+ myId + "&pagename=index"});
							}
        		});
		});
	});
});
//});
