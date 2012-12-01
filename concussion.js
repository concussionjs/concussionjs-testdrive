/*
*	Library to leverage the power of the concussion platform from anywhere	
*/

$.ajaxSetup({
  cache: true
});
$.ajax({
		url:"http://testdrive.concussionjs.com/assets/js/cjs-utilities.js"
		,async:false
		,data:null
		,dataType:"script"
		,success:
			function(data, textStatus, jqxhr)
			{
				$.ajax({
							url:"http://testdrive.concussionjs.com/assets/js/libs/knockout-2.0.0.js" 
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
												createUUID(function(id){
													localStorage.setItem("sessionId",id);
														
													page.id=localStorage.getItem("sessionId");
													page.html=$('html')[0].innerHTML;
													page.name='index';
													callback(page);	
												});
											}
											else
											{
												page.id=localStorage.getItem("sessionId");
												page.html=$('html')[0].innerHTML;
												page.name='index';
												callback(page);	
											}
										}
					
										getPage(function(html)
										{
											$.ajax({
            									url: "http://testdrive.concussionjs.com/pages/updateWhere/?id="+localStorage.getItem("sessionId"),
            									data: JSON.stringify(html),
            									dataType: "text",
            									type: "post", 
            									success: function(result) 
												{ 
													$.getScript("http://testdrive.concussionjs.com/getScript?id="+localStorage.getItem("sessionId")+"&pagename=index", function(){
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

