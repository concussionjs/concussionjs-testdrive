var justDoIt=[];
justDoIt[0]="<!DOCTYPE html><html>\n\
<head><title>Contacts</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"contacts-style.css\"></head>\n\
<body>\n\
  <div id=\"contacts\">\n\
    <div class=\"vcard\">\n\
      <input class=\"fn\" value=\"First Last\">\n\
      <input class=\"email\" value=\"address@email.com\">\n\
      <input class=\"tel\" value=\"+1.818.555.1212\">\n\
    </div>\n\
  </div>\n\
</body>\n\
</html>";

justDoIt[1]="<!DOCTYPE html><html>\n\
<head><title>Contacts</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"contacts-style.css\"></head>\n\
<body>\n\
  <div id=\"contacts\" data-bind=\"foreach:contacts\">\n\
    <div class=\"vcard\">\n\
      <input class=\"fn\" data-bind=\"value:name\">\n\
      <input class=\"email\" data-bind=\"value:email\">\n\
      <input class=\"tel\" data-bind=\"value:phone\">\n\
    </div>\n\
</div>\n\
</body>\n\
</html>";

justDoIt[2]="<!DOCTYPE html><html>\n\
<head><title>Contacts</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"contacts-style.css\"></head>\n\
<body>\n\
  <form data-bind=\"submit:contacts_create\">\n\
<div class=\"new-contact\">\n\
  <input class=\"fn\" placeholder=\"Contact Name\" data-bind=\"value:contacts_name\">\n\
  <input class=\"email\" placeholder=\"Email Address\" data-bind=\"value:contacts_email\">\n\
  <input class=\"phone\" placeholder=\"Phone Number\" data-bind=\"value:contacts_phone\">\n\
  <button>Add record</button>\n\
</div>\n\
</form>\n\
<div id=\"contacts\" data-bind=\"foreach:contacts\">\n\
    <div class=\"vcard\">\n\
      <input class=\"fn\" data-bind=\"value:name\">\n\
      <input class=\"email\" data-bind=\"value:email\">\n\
      <input class=\"tel\" data-bind=\"value:phone\">\n\
  </div>\n\
</div>\n\
</div>\n\
</body>\n\
</html>";

justDoIt[3]="<!DOCTYPE html><html>\n\
<head><title>Contacts</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"contacts-style.css\"></head>\n\
<body>\n\
  <form data-bind=\"submit:contacts_create\">\n\
<div class=\"new-contact\">\n\
  <input class=\"fn\" placeholder=\"Contact Name\" data-bind=\"value:contacts_name\">\n\
  <input class=\"email\" placeholder=\"Email Address\" data-bind=\"value:contacts_email\">\n\
  <input class=\"phone\" placeholder=\"Phone Number\" data-bind=\"value:contacts_phone\">\n\
  <input class=\"bday\" placeholder=\"Birthday\" data-bind=\"value:contacts_birthday\">\n\
  <button>Add record</button>\n\
</div>\n\
</form>\n\
<div id=\"contacts\" data-bind=\"foreach:contacts\">\n\
    <div class=\"vcard\">\n\
      <input class=\"fn\" data-bind=\"value:name\">\n\
      <input class=\"email\" data-bind=\"value:email\">\n\
      <input class=\"tel\" data-bind=\"value:phone\">\n\
  </div>\n\
</div>\n\
</div>\n\
</body>\n\
</html>";

justDoIt[4]="<!DOCTYPE html><html>\n\
<head><title>Contacts</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"contacts-style.css\"></head>\n\
<body>\n\
  <form data-bind=\"submit:contacts_create\">\n\
<div class=\"new-contact\">\n\
  <input class=\"fn\" placeholder=\"Contact Name\" data-bind=\"value:contacts_name\">\n\
  <input class=\"email\" placeholder=\"Email Address\" data-bind=\"value:contacts_email\">\n\
  <input class=\"phone\" placeholder=\"Phone Number\" data-bind=\"value:contacts_phone\">\n\
  <input class=\"bday\" placeholder=\"Birthday\" data-bind=\"value:contacts_birthday\">\n\
  <button>Add record</button>\n\
</div>\n\
</form>\n\
<div id=\"contacts\" data-bind=\"foreach:contacts\">\n\
    <div class=\"vcard\">\n\
      <input class=\"fn\" data-bind=\"value:name\">\n\
      <input class=\"email\" data-bind=\"value:email\">\n\
      <input class=\"tel\" data-bind=\"value:phone\">\n\
      <input class=\"bday\" data-bind=\"value:birthday\">\n\
  </div>\n\
</div>\n\
</div>\n\
</body>\n\
</html>";

justDoIt[5]="<!DOCTYPE html><html>\n\
<head><title>Contacts</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"contacts-style.css\"></head>\n\
<body>\n\
  <form data-bind=\"submit:contacts_create\">\n\
<div class=\"new-contact\">\n\
  <input class=\"fn\" placeholder=\"Contact Name\" data-bind=\"value:contacts_name\">\n\
  <input class=\"email\" placeholder=\"Email Address\" data-bind=\"value:contacts_email\">\n\
  <input class=\"phone\" placeholder=\"Phone Number\" data-bind=\"value:contacts_phone\">\n\
  <input class=\"bday\" placeholder=\"Birthday\" data-bind=\"value:contacts_birthday\">\n\
  <button>Add record</button>\n\
</div>\n\
</form>\n\
<div id=\"contacts\" data-bind=\"foreach:contacts\">\n\
    <div class=\"vcard\">\n\
      <input class=\"fn\" data-bind=\"value:name\">\n\
      <input class=\"email\" data-bind=\"value:email\">\n\
      <input class=\"tel\" data-bind=\"value:phone\">\n\
      <input class=\"bday\" data-bind=\"value:birthday\">\n\
      <button data-bind=\"click:contacts_update\">Save</button><button class=\"secondary\" data-bind=\"click:contacts_delete\">Delete</button>\n\
  </div>\n\
</div>";