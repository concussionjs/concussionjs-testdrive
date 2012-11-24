/*
*	Library to leverage the power of the concussion platform from anywhere	
*/

//$.getScript("http://testdrive.concussionjs.com/assets/js/libs/jquery-1.7.1.min.js",function(){
// alert("**ALERT:top of bootstrap**");
$.ajaxSetup({
  cache: true
});
$.ajax({
		url:"http://testdrive.local-concussionjs.com/assets/js/cjs-utilities.js"
		,async:false
		,data:null
		,dataType:"script"
		,success:
			function(data, textStatus, jqxhr)
			{
				/*alert(data); //data returned
   				alert(textStatus); //success
   				alert(jqxhr.status); //200*/
				$.ajax({
							url:"http://testdrive.local-concussionjs.com/assets/js/libs/knockout-2.0.0.js" 
							,async:false
							,data:null
							,dataType:"script"
							,success:
								function()
								{   									
									$(document).ready(function()
									{
										function getPage(callback)
										{
											// alert("**ALERT:inside of get page**");
											var vars = [], hash;
			    							var q = document.URL.split('?')[1];
			    							page= {};
			    							if(q != undefined)
			    							{
			        							q = q.split('&');
			        							for(var i = 0; i < q.length; i++)
			        							{
			            							hash = q[i].split('=');
			            							vars.push(hash[1]);
			            							vars[hash[0]] = hash[1];
			        							}
											}
						
											if(!vars["sid"] && !localStorage.getItem("sessionId"))
											{
												// alert("**ALERT:no sessionId**");
												createUUID(function(id){
													// alert("inside no cookie " + id);
													localStorage.setItem("sessionId",id);
							
													// alert(localStorage.getItem("sessionId"));
							
													page.id=localStorage.getItem("sessionId");
													page.html=$('html')[0].innerHTML;
													page.name='index';
													callback(page);	
												});
											}
											else
											{
												// alert("**ALERT:has sessionId**");
												page.id=localStorage.getItem("sessionId");
												page.html=$('html')[0].innerHTML;
												page.name='index';
												callback(page);	
											}
										}
							
										// alert("**ALERT:just before getPage is called**");
					
										getPage(function(html)
										{
											// alert("**ALERT:inside of call to get page**");
											$.ajax({
            									url: "http://testdrive.local-concussionjs.com/pages/updateWhere/?id="+localStorage.getItem("sessionId"),
            									data: JSON.stringify(html),
            									dataType: "text",
            									type: "post", 
            									success: function(result) 
												{ 
													// alert("call to update was successful");
													$.getScript("http://testdrive.local-concussionjs.com/getScript?id="+localStorage.getItem("sessionId")+"&pagename=index", function(){
   														// alert("Script loaded and executed.");
													});
													
													$("body").append("<a href=\"#\" onclick=\"window.open(\'http://testdrive.concussionjs.com/admin?id=" + localStorage.getItem("sessionId") + "\');\"> admin </a>");
												}
        									});
        								});
									});
								}
						});
			}
		});

