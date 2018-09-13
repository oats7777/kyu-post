$(function() {
  var getQueryObject = function() {
    var search = location.search.substr(1);
    // www.naver.com/aaaa?asfasdf
    // asdfasdf 반환
    try {
      return JSON.parse(
        '{"' +
        decodeURI(search) // 인코딩된 URI 해독
          .replace(/"/g, '\\"') // "로된건 전부 \"로 바꿈
          .replace(/&/g, '","') // &된건 전부 ","으로 바꿈
          .replace(/=/g, '":"') + // =된건 전부 ":"로 바꿈
          '"}'
      );
    } catch {
      return {};
    }
  };
  function changeNewlineString(str) {
    return str
      .replace(/\n/g, "\\\\n") // \n \n
      .replace(/\r/g, "\\\\r")
      .replace(/\t/g, "\\\\t");
  }

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
    console.log("sArr", sArr);
    var data = "";
    $.each($("#postForm").serializeArray(), function(key, val) {
      data += ',"' + val["name"] + '":"' + val["value"] + '"';
    });
    data = "{" + data.substr(1) + "}";
    var Jdata = JSON.parse(changeNewlineString(data));
    $.ajax({
      type: "PUT",
      url: "/update?id=" + id + "&JSPW=" + password,
      data: Jdata,
      success: function() {
        window.location = "/viewPage?id=" + id;
      },
      error: function() {
        alert("비밀번호가 알맞지 않습니다.");
      }
    });
  });
});
