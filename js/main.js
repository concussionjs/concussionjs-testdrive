// Set up the ace editor
//var editor = ace.edit("editor");
//editor.setTheme("ace/theme/concussion");
//editor.getSession().setMode("ace/mode/html");
//editor.setShowPrintMargin(false);

// Define the inital content of the editor
//editor.setValue('<!DOCTYPE html><html>\n<head><title>Contacts</title><meta charset="utf-8"><link rel="stylesheet" href="contacts-style.css"></head>\n<body>\n    <div class="new-contact">\n        <input class="fn" placeholder="Name">\n        <input class="email" placeholder="E-Mail">\n        <input class="tel" placeholder="Phone">\n        <button>Add contact</button>\n    </div>\n    <div id="contacts">\n        <div class="vcard">\n            <input class="fn" value="Sally Ride">\n            <input class="email" value="sally@example.com">\n            <input class="tel" value="+1.818.555.1212">\n            <button>Save</button><button>Delete</button>\n        </div>\n    </div>\n</body>\n</html>\n',-1); 

// Resize the editor and iframes when the browser resizes
function getSizables() {
	sizables = new Array();
	sizables[0] = document.getElementById("editor");
	sizables[1] = document.getElementById("contacts");
	sizables[2] = document.getElementById("admin-app");
	resizeSizables();
}

function resizeSizables() {
	var parent;
	for( var i=0; i<sizables.length; i++ ) {
		parent = sizables[i].parentNode;
		sizables[i].style.width = parent.offsetWidth -1 + "px";
		sizables[i].style.height = parent.offsetHeight -2 + "px";
	}
}
getSizables();
window.onresize = resizeSizables;

// Fix for iOS which doesn't fire events on lable taps
var iPadLabels = function () {
	function fix() {
		var labels = document.getElementsByTagName('label'), 
		target_id, 
		el;
		for (var i = 0; labels[i]; i++) {
			if (labels[i].getAttribute('for')) {
				labels[i].onclick = labelClick;
			}
		}
	};
	function labelClick() {
		el = document.getElementById(this.getAttribute('for'));
		if (['radio', 'checkbox'].indexOf(el.getAttribute('type')) != -1) {
			el.setAttribute('selected', !el.getAttribute('selected'));
		} else {
			el.focus();
		}
	};
	return {
		fix: fix
	}
}();
window.onload = function () {
	iPadLabels.fix();
	}