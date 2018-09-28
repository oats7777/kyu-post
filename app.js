// Setup
const express = require("express"); // express 사용
const app = express(); // 위에꺼랑 같이 써야됨
const mongoose = require("mongoose"); // mongoose 사용
mongoose.connect(
  "mongodb://localhost:27017/kyu-post",
  { useNewUrlParser: true }
); // 커넥트해서 서버 주소랑 열 경로 지정
const Post = mongoose.model("Post", {
  PostsNum: String,
  posts: String,
  title: String,
  UserName: String,
  PW: String,
  date: { type: Date, default: Date.now },
  count: { type: Number, default: 0 }
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
  var page = req.query.page;
  if (page == null || page == 0) {
    page = 1;
  }
  var intPage = parseInt(page);
  var totalPage = 1;
  const pageListCount = 10;
  const pageNumberConut = 10;
  Post.countDocuments({}, (err, totalCount) => {
    if (err) res.sendStatus(500);
    totalPage = Math.ceil(totalCount / pageListCount);
    if (intPage > totalPage) {
      page = totalPage;
      intPage = totalPage;
    }
    var skipSize = (intPage - 1) * pageListCount;
    var startPage =
      Math.floor((intPage - 1) / pageNumberConut) * pageNumberConut + 1;
    var endPage = startPage + pageNumberConut - 1;
    if (page > 6) {
      endPage = intPage + 4;
      startPage = intPage - 5;
    }
    if (endPage > totalPage) {
      endPage = totalPage;
    }
    Post.find({})
      .sort({ date: -1 })
      .skip(skipSize)
      .limit(pageListCount)
      .then(results => {
        res.render("index", {
          results: results,
          pagination: totalPage,
          start: startPage,
          end: endPage,
          page: page,
          intPage: intPage,
          totalCount: totalCount,
          skipSize: skipSize
        });
      })
      .catch(err => {
        res.render("index", { results: "" });
      });
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
  Post.findOne({ _id: query.id }, (err, result) => {
    result.posts = reverseChangeNewlineString(result.posts);
    result.count += 1;
    result.save(function(err) {
      res.render("viewPage", { result: result });
    });
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
      Post.deleteOne({
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
