$(function() {
  var getQueryObject = function() {
    var search = location.search.substring(1);
    try {
      return JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
    } catch {
      return {};
    }
  };

  var id = getQueryObject().id;
  if (id) {
    console.log("Test1", id);
    $(".HIDE").hide();
    //$('.addpost').hide();
  } else {
    console.log("Test2", id);
    $(".back").hide();
  }

  $("#fm").click(function() {
    var password = prompt("비밀번호를 입력해주세요");
    var id = getQueryObject().id;
    var sArr = $("#postForm").serializeArray();
    var data = "";
    $.each($("#postForm").serializeArray(), function(key, val) {
      data += ',"' + val["name"] + '":"' + val["value"] + '"';
    });

    data = "{" + data.substr(1) + "}";

    console.log("data", data);
    $.ajax({
      type: "PUT",
      url: "/update?id=" + id + "&JSPW=" + password,
      data: JSON.parse(data),
      success: function(data) {
        window.location = "/viewPage?id=" + id;
      },
      error: function(msg) {
        alert("비밀번호가 알맞지 않습니다.");
      }
    });
  });
});
