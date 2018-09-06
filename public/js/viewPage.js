//document.write("<script type='text/javascript' src='jquery.js' ><" + "/script>");
var getQueryObject = function() {
  var search = location.search.substring(1);
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"')+ '"}')
}

$(function() {
  $('.del').click(function(){
    var id = getQueryObject().id;
    $.ajax({
      type: "DELETE",
      url: "/postDel?id=" + id,
      success: function(msg){
        alert("Data Deleted: " + msg);
        window.location = '/';
      }
    });
  });
});