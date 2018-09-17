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
  $("#updatePwCheck").click(function() {
    var password = prompt("비밀번호를 입력해주세요");
    var id = getQueryObject().id;
    $.ajax({
      type: "GET",
      url: "/postUpdate?id=" + id + "&JSPW=" + password,
      success: function() {
        window.location = "/write?id=" + id;
      },
      error: function() {
        alert("비밀번호가 알맞지 않습니다.");
      }
    });
  });
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
