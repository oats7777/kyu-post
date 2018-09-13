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
  function getJson(str) {
    return str
      .replace(/\\n/g, "\n") // \n \n
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t");
  }
  data = getJson($("#posts").val());
  console.log("posts:", data);
  $("#posts").val(data);
  $(".del").click(function() {
    var password = prompt("비밀번호를 입력해주세요");
    var id = getQueryObject().id;
    $.ajax({
      type: "DELETE",
      url: "/postDel?id=" + id + "&JSPW=" + password,
      success: function(msg) {
        window.location = "/";
      },
      error: function(msg) {
        alert("비밀번호가 알맞지 않습니다.");
      }
    });
  });
});
