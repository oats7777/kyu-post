$(function() {
  function getJson(str) {
    return str
      .replace(/\\n/g, "\n") // \n \n
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t");
  }
  data = getJson($(".postsText").val());
  $(".postsText").val(data);
  console.log($(".postsText").val());
});
