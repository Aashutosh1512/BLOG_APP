const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlEncodedBodyParser = bodyParser.urlencoded({ extended: false });
const mariadb = require("mariadb");
const port = 5050;
const { body, validationResult } = require("express-validator");
const expressFileUpload=require('express-fileupload');
const fileUpload = require("express-fileupload");
const { upload } = require("@testing-library/user-event/dist/upload");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const bcrypt = require("bcrypt");
const { response } = require("express");
const saltRounds = 10;
app.use(express.json());
app.get("/", function (request, response) {
  response.send("HI");
});
app.use(
  expressFileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);
var noCards=0;
app.get("/getBlogCards", async (request, response) => {
  class GetCards {
    constructor(id, image, title, body, bottom) {
      this.id = id;
      this.image = image;
      this.title = title;
      this.body = body;
      this.bottom = bottom;
    }
  }
  const connection = await mariadb.createConnection({
    user: "root",
    password: "12345678",
    database: "collage",
    host: "localhost",
    port: 5506,
  });
  noCards=0;
  var cards = [];
  var resultSet = [];
  try {
    resultSet = await connection.query(`select * from blogscards;`);
  } catch (error) {
    response.send(error);
    await connection.end();
  }
  var i = 0,
    card;
  var id, image, title, body, bottom;

  while (i < resultSet.length) {
    noCards++;
    id = resultSet[i].id;
    image = resultSet[i].image;
    title = resultSet[i].title;
    body = resultSet[i].body;
    bottom = resultSet[i].bottom;
    card = new GetCards(id, image, title, body, bottom);
    console.log(card);
    cards.push(card);
    i++;
  }

  await connection.end();
  response.send(cards);
});

app.get("/getFAQ", async (request, response) => {
  class FAQ {
    constructor(id, question, answer,direction) {
      this.id = id;
      this.question = question;
      this.answer = answer;
      this.direction=direction;
    }
  }
  const connection = await mariadb.createConnection({
    user: "root",
    password: "12345678",
    database: "collage",
    host: "localhost",
    port: 5506,
  });
  var faqs = [];
  var resultSet = [];
  try {
    resultSet = await connection.query(`select * from FAQ;`);
  } catch (error) {
    response.send(error);
    await connection.end();
  }
  var i = 0,
    faq;
  var id, question, answer, direction;
 console.log(resultSet[0].direction);
  while (i < resultSet.length) {
    id = resultSet[i].id;
    question = resultSet[i].question;
    answer = resultSet[i].answer;
    direction = resultSet[i].direction;
 
    faq = new FAQ(id, question, answer, direction);
  
    faqs.push(faq);
    i++;
  }

  await connection.end();
  response.send(faqs);
});
app.post("/addingFaq", urlEncodedBodyParser, async (request, response) => {
  class FAQ {
    constructor(id, question, answer,loc) {
      this.id = id;
      this.question = question;
      this.answer = answer;
      this.loc=loc
    }
  }

  const connection = await mariadb.createConnection({
    user: "root",
    password: "12345678",
    database: "collage",
    host: "localhost",
    port: 5506,
  });
  console.log(request.body);
  const question = request.body.question;
  const answer = request.body.answer;
 
  console.log(question);

  try {
    await connection.query(
      `insert into faq values(0,'${question}','${answer}',"");`
    );
  } catch (error) {
    response.end(error);
    connection.end();
  }
  await connection.end();
  response.send({ success: true });
});
var ImageNameUpload="";
app.post("/uploadCard", urlEncodedBodyParser,async function (request, response) {
  console.log(request.body);
  class CARDS {
    constructor(id, title,image, body) {
      this.id = id;
      this.title = title;
      this.image=image;
      this.body = body;
    }
  }

  const connection =await mariadb.createConnection({
    user: "root",
    password: "12345678",
    database: "collage",
    host: "localhost",
    port: 5506,
  });
  
  const title = request.body.title;
  const body = request.body.body;
  const image = ImageNameUpload;
console.log(image)

  try {
    await connection.query(
      `insert into blogsCards values(0,'${image}','${title}','${body}');`
    );  
  } catch (error) {
    response.end(error);
    connection.end();
  }
  await connection.end();
  response.send({ success: true });
  
});
app.post('/upload',function(request,response){
     console.log(request.files.image.name);
     var fileUploadPath = __dirname+"/upload/"+`${noCards}.jpg`;
     ImageNameUpload = noCards;
     console.log(fileUploadPath);
     let UploadDone = true;
     request.files.image.mv(fileUploadPath, function () {
       UploadDone = false;
     });
     if (UploadDone === true) {
       response.send("DONE");
       noCards++;
     } else {
       response.send({ success: false });
     }
})

app.post("/register", urlEncodedBodyParser, async(req, res) => {
  const connection = await mariadb.createConnection({
    user: "root",
    password: "12345678",
    database: "collage",
    host: "localhost",
    port: 5506,
  });
  const username = req.body.username;
  const password = req.body.password;
  console.log(username+''+password)
var resultSet={};
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
    }

   resultSet =await connection.query(
     `INSERT INTO users VALUES (0,'${username}', '${hash}');`
   );
    if(resultSet){
      console.log(resultSet);
    }
    connection.end();
    res.send({success:true})
  });
});

app.get("/login", urlEncodedBodyParser, async (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", urlEncodedBodyParser, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const connection = await mariadb.createConnection({
    user: "root",
    password: "12345678",
    database: "collage",
    host: "localhost",
    port: 5506,
  });
  const resultSet=await connection.query(
    `SELECT * FROM users WHERE mail = '${username}';`
  )
      if (resultSet.error) {
        res.send({ err: resultSet.error });
      }

      if (resultSet.length > 0) {
        bcrypt.compare(password, resultSet[0].PASSWORD, (error, response) => {
          if (response) {
            req.session.user = resultSet;
            console.log(req.session.user);
            console.log(resultSet[0]);
            res.send({ success: true,resultSet });
          } else {
            res.send({ success:false,message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ success:false,message: "User doesn't exist" });
      }
    
});


app.listen(port, function (error) {
  if (error) return console.log("Something is wrong...." + error);
  return console.log("Server is starting on port " + port);
});
