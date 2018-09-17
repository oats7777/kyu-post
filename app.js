// Setup
const express = require("express"); // express 사용
const app = express(); // 위에꺼랑 같이 써야됨
const mongoose = require("mongoose"); // mongoose 사용
mongoose.connect("mongodb://localhost:27017/kyu-post"); // 커넥트해서 서버 주소랑 열 경로 지정
const Post = mongoose.model("Post", {
  PostsNum: String,
  posts: String,
  title: String,
  UserName: String,
  PW: String
}); // 스키마를 지정? 해주는거 같다
const bodyParser = require("body-parser"); // bodyParser 는 form사용 가능하게 해주는거 같다
app.use(bodyParser.json()); // 형태는 json 형태로
app.use(bodyParser.urlencoded({ extended: true })); //이거 안해주면 form 으로 전송해도 에러나서 설정 꼭 해줘야한다
app.use(express.static("public"));
app.set("view engine", "pug"); // html 태그대신 읽고 쓰기 좋은 pug 사용
function reverseChangeNewlineString(str) {
  return str
    .replace(/\\n/g, "\n") // \n \n
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}
// Routes
// index Pages
app.get("/", (req, res) => {
  const query = req.query; // 자바스크립트 쿼리 스트링 만 추출 (뭔가했다)
  Post.find({}, (err, results) => {
    // mongoDB에서 데이터 찾기
    res.render("index", { results: results }); // results 의 값 랜더링
  });
});

// write page
app.get("/write", (req, res) => {
  const query = req.query;
  console.log(query);
  if (query.id) {
    Post.find({ _id: query.id }, (err, result) => {
      r = result[0];
      r.posts = reverseChangeNewlineString(r.posts);
      res.render("write", { result: r });
    });
  } else {
    res.render("write", { result: "" });
  }
});

app.get("/viewPage", (req, res) => {
  const query = req.query;
  Post.find({ _id: query.id }, (err, result) => {
    r = result[0];
    r.posts = reverseChangeNewlineString(r.posts);
    res.render("viewPage", { result: r });
  });
});
app.get("/postUpdate", (req, res) => {
  const query = req.query;
  Post.findById(query.id, function(err, post) {
    console.log(query);
    if (query.JSPW == post.PW) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

// API
// add post api
app.post("/addpost", (req, res) => {
  const post = new Post(req.body); // req에서는 body로 해놔야 나중에 값을 저장시킬 수? 있다
  post
    .save()
    .then(aa => {
      res.redirect("/viewPage?id=" + aa._id);
    })
    .catch(err => {
      console.log(`Error in save`);
    });
});
app.delete("/postDel", (req, res) => {
  const query = req.query;
  Post.findById(query.id, function(err, post) {
    if (query.JSPW == post.PW) {
      Post.remove({
        $and: [{ _id: query.id }, { PW: query.JSPW }]
      }).then(() => {
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(500);
    }
  });
});
app.put("/update", (req, res) => {
  const query = req.query;
  console.log(query);

  // update db query
  Post.findById(query.id, function(err, post) {
    if (err) return res.status(500).json({ error: "database failure" });
    if (!post) return res.status(404).json({ error: "post not found" });
    if (req.body.title) post.title = req.body.title;
    if (req.body.posts) post.posts = req.body.posts;
    if (req.body.UserName) post.UserName = req.body.UserName;
    post.save(function(err) {
      if (err) res.status(500).json({ error: "failed to update" });
      res.sendStatus(200);
    });
  });
});
// Listening
app.listen(3000, () => {
  console.log("Server listening on 3000");
});
