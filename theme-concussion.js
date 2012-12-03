define('ace/theme/concussion', ['require', 'exports', 'module', 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-concussion";
exports.cssText = "\
.ace-concussion .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-concussion .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-concussion .ace_gutter {\
  background: none;\
  color: rgba(255,255,255,.1);\
}\
\
.ace-concussion .ace_print_margin {\
  width: 1px;\
  background: #3b3b3b;\
}\
\
.ace-concussion .ace_scroller {\
  background-color: none;\
}\
\
.ace-concussion .ace_text-layer {\
  color: rgba(255,255,255,.75);\
}\
\
.ace-concussion .ace_cursor {\
  border-left: 2px solid #6499CC;\
}\
\
.ace-concussion .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid #6499CC;\
}\
\
.ace-concussion .ace_marker-layer .ace_selection {\
  background: rgba(90, 100, 126, 0.88);\
}\
\
.ace-concussion.multiselect .ace_selection.start {\
  box-shadow: 0 0 3px 0px #323232;\
  border-radius: 2px;\
}\
\
.ace-concussion .ace_marker-layer .ace_step {\
  background: rgb(102, 82, 0);\
}\
\
.ace-concussion .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid #404040;\
}\
\
.ace-concussion .ace_marker-layer .ace_active_line {\
}\
\
.ace-concussion .ace_gutter_active_line {\
}\
\
.ace-concussion .ace_marker-layer .ace_selected_word {\
  border: 1px solid rgba(90, 100, 126, 0.88);\
}\
\
.ace-concussion .ace_invisible {\
  color: #404040;\
}\
\
.ace-concussion .ace_keyword, .ace-concussion .ace_meta {\
  color:rgba(255,255,255,.5);\
}\
\
.ace-concussion .ace_constant, .ace-concussion .ace_constant.ace_other {\
  color:#6C99BB;\
}\
\
.ace-concussion .ace_constant.ace_character,  {\
  color:#6C99BB;\
}\
\
.ace-concussion .ace_constant.ace_character.ace_escape,  {\
  color:#6C99BB;\
}\
\
.ace-concussion .ace_invalid {\
  color:#FFFFFF;\
background-color:#FF0000;\
}\
\
.ace-concussion .ace_support.ace_constant {\
  color:#6C99BB;\
}\
\
.ace-concussion .ace_fold {\
    background-color: #CC7833;\
    border-color: #FFFFFF;\
}\
\
.ace-concussion .ace_support.ace_function {\
  color:#B83426;\
}\
\
.ace-concussion .ace_variable.ace_parameter {\
  font-style:italic;\
}\
\
.ace-concussion .ace_string {\
  color:#69c;\
}\
\
.ace-concussion .ace_string.ace_regexp {\
  color:#CCCC33;\
}\
\
.ace-concussion .ace_comment {\
  font-style:italic;\
color:#BC9458;\
}\
\
.ace-concussion .ace_meta.ace_tag {\
  color:rgba(255,255,255,.5);\
}\
\
.ace-concussion .ace_entity.ace_name {\
  color:#FFC66D;\
}\
\
.ace-concussion .ace_markup.ace_underline {\
    text-decoration:underline;\
}\
\
.ace-concussion .ace_collab.ace_user1 {\
  color:#323232;\
  background-color:#FFF980;\
}\
\
.ace-concussion .ace_indent-guide {\
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMwMjL6zzBz5sz/ABEUBGCqhK6UAAAAAElFTkSuQmCC) right repeat-y;\
}";

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});