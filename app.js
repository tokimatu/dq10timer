// expressモジュールを読み込む
const express = require('express');
const app = express();
const path = require('path');
// const bodyParser = require('body-parser');
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = require('socket.io')(server);
const assert = require('assert');


app.set("view engine", "ejs");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.use('/htdocs', express.static(path.join(__dirname, '/htdocs')));

app.get('/index', (req, res, next) => {
    res.render('index');
});


// mongoDbに接続

/* const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tokimatu:@nnayc001@cluster0-d8low.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbName = 'dqx';
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let data = [];
for (let i = 0; i < 40; i++) {
    data.push({
        name: 'dqx',
        no: i + 1,
        Hour: '',
        Minute: '',
        area: '',
        type: '',
    })

}

// データベースの初期化
MongoClient.connect(uri, connectOption, (err, client) => {
    let bb;
    const collection = client.db('dqx').collection('timer');
    collection.find({
        name: "dqx"
    }).toArray(async(err, res) => {
        if (err) throw err;
        // resにDB検索結果が設定されます。

        if (Object.keys(res).length != 40) {
            await collection.remove({ name: 'dqx' }, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("成功");
                }
            });
            await collection.insertMany(data);
        }
        client.close();
    });
});*/

class TLIST {
    constructor(id, no, type, hourTime, minuteTime) {
        this.id = id;
        this.no = no;
        this.type = type;
        this.hourTime = hourTime;
        this.minuteTime = minuteTime;
    }
}

let TimeListG = [];
let TimeListY = [];
let TimeListS = [];

for (let i = 0; i < 40; i++) {
    TimeListG[i] = new TLIST(0, i + 1, '', '', '');
    TimeListY[i] = new TLIST(0, i + 1, '', '', '');
    TimeListS[i] = new TLIST(0, i + 1, '', '', '');
}


io.sockets.on('connection', (socket) => {
    let id = socket.id;
    io.to(id).emit('init', { a: TimeListG, b: TimeListY, c: TimeListS });

    socket.on('setTimeType', (data) => {

        io.emit('allSetTime', data);
        if (data.area == 1) {
            console.log("幻");
            TimeListG[data.serverNo - 1].no = data.serverNo;
            TimeListG[data.serverNo - 1].type = data.type;
            TimeListG[data.serverNo - 1].minuteTime = data.minuteTime;
            TimeListG[data.serverNo - 1].hourTime = data.hourTime;

        } else if (data.area == 3) {
            console.log("山");
            TimeListY[data.serverNo - 1].no = data.serverNo;
            TimeListY[data.serverNo - 1].type = data.type;
            TimeListY[data.serverNo - 1].minuteTime = data.minuteTime;
            TimeListY[data.serverNo - 1].hourTime = data.hourTime;
        } else if (data.area == 5) {
            console.log("砂");
            TimeListS[data.serverNo - 1].no = data.serverNo;
            TimeListS[data.serverNo - 1].type = data.type;
            TimeListS[data.serverNo - 1].minuteTime = data.minuteTime;
            TimeListS[data.serverNo - 1].hourTime = data.hourTime;
        }
    });

    socket.on('disconnect', () => {});

});

server.listen(port, () => console.log(`Listening on Port 3000`));