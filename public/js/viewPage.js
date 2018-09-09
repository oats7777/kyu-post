//document.write("<script type='text/javascript' src='jquery.js' ><" + "/script>");
var getQueryObject = function() {
  var search = location.search.substring(1);
  return JSON.parse(
    '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
};

$(function() {
  $(".del").click(function() {
    var DELETE_BOOL = confirm("삭제하시겠습니까?");
    if (DELETE_BOOL) {
      var id = getQueryObject().id;
      $.ajax({
        type: "DELETE",
        url: "/postDel?id=" + id,
        success: function(msg) {
          window.location = "/";
        }
      });
    }
  });
});
