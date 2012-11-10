			function createUUID() {
    		
    			var s = [];
    			var hexDigits = "0123456789abcdef";
    			for (var i = 0; i < 36; i++) {
    			    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    			}
    			s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    			s[8] = s[13] = s[18] = s[23] = "";

    			var uuid = s.join("");
    			//alert(uuid);
    			return uuid;
			}

			function createUUID(callback) {
    			var s = [];
    			var hexDigits = "0123456789abcdef";
    			for (var i = 0; i < 36; i++) {
    			    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    			}
    			s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    			s[8] = s[13] = s[18] = s[23] = "";

    			var uuid = s.join("");
    			//alert(uuid);
    			callback(uuid);
			}

			function getUUID(callback) {
    			$.get("http://testdrive.concussionjs.com/getUUID",function(res)
    			{
    				callback(res);
    			});	
			}

			function createCookie(name,value,days) {
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var expires = "; expires="+date.toGMTString();
				}
				else var expires = "";
				document.cookie = name+"="+value+expires+"; path=/";
			}

			function readCookie(name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				//alert(document.cookie);
				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				return null;
			}

			function eraseCookie(name) {
				createCookie(name,"",-1);
			}