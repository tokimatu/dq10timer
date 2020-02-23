// expressモジュールを読み込む
const express = require('express');
const app = express();
const path = require('path');
// const bodyParser = require('body-parser');
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer(app);
// const io = require('socket.io')(server);

app.set("view engine", "ejs");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.use('/htdocs',express.static(path.join(__dirname, '/htdocs')));

app.get('/index', (req, res, next) => {
  res.render('index');
});


/* io.sockets.on('connection', (socket) => {
//   let id = socket.id;


  socket.on('disconnect', () => {
  });

});
 */
server.listen(port, () => console.log(`Listening on Port 3000`));