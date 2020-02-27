let socket = io();
let tbList = document.getElementById("tableList");
let audioElem;
console.log(tbList.rows[1]);
tbList.rows[1].cells[0].childNodes[0].setAttribute('value', '1');
for (let i = 0; ++i < 40;) {
    tbList.appendChild(tbList.rows[1].cloneNode(true));
    tbList.lastChild.cells[0].childNodes[0].setAttribute('value', String(i + 1));
}

// クラスの定義
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

for (let i = 0; i < 40; i++) {
    tbList.rows[i + 1].cells[0].childNodes[0].setAttribute('value', TimeListG[i].no);
    tbList.rows[i + 1].cells[1].childNodes[0].setAttribute('value', TimeListG[i].type);
    tbList.rows[i + 1].cells[2].childNodes[0].setAttribute('value', TimeListG[i].time);
    tbList.rows[i + 1].cells[3].childNodes[0].setAttribute('value', TimeListY[i].type);
    tbList.rows[i + 1].cells[4].childNodes[0].setAttribute('value', TimeListY[i].time);
    tbList.rows[i + 1].cells[5].childNodes[0].setAttribute('value', TimeListS[i].type);
    tbList.rows[i + 1].cells[6].childNodes[0].setAttribute('value', TimeListS[i].time);
}

window.onload = () => {

    document.getElementById("updateBtn").addEventListener("click", () => {
        let serverNo = hankaku2Zenkaku(document.form1.serverNo.value);
        let areaNo = document.form1.area.selectedIndex;
        let area = document.form1.area.options[areaNo].value;
        let typeNo = document.form1.type.selectedIndex;
        let type = document.form1.type.options[typeNo].value;

        let now = new Date();
        let hour = ('00' + now.getHours()).slice(-2);
        let minute = ('00' + now.getMinutes()).slice(-2);
        let seconds = hour * 3600 + minute * 60;
        console.log(seconds);

        if (isNaN(serverNo) || serverNo == "" || serverNo < 1 || serverNo > 40) {
            console.error("サーバー番号が不正です。");
            alert("数値を入力してください。");
            return;
        } else if (!areaNo || !typeNo) {
            console.error("種類か場所が不正です。");
            alert("種類と場所を選択してください。");
            return;
        }
        tbList.rows[serverNo].cells[Number(area)].childNodes[0].setAttribute('value', type);
        tbList.rows[serverNo].cells[Number(area) + 1].childNodes[0].setAttribute(
            'value', hour + ':' + +minute);
        socket.emit('setTime', {
            serverNo: serverNo,
            type: type,
            minuteTime: minute,
            hourTime: hour,
            area: area
        });
    });

    setInterval(() => {
        let now = new Date();
        let second = now.getSeconds();

        if (second == 0) {

            for (let i = 0; i < 40; i++) {
                let hour = now.getHours();
                let minute = now.getMinutes();
                let seconds = hour * 3600 + minute * 60;
                let listTime;
                let listSecond;
                let t55, t60;
                let nowtime = ('00' + hour).slice(-2) + ':' + ('00' + minute).slice(-2);
                if (seconds < 14400) {
                    seconds = seconds + 86400;
                }

                for (let j = 2; j <= 6; j = j + 2) {
                    listTime = tbList.rows[i + 1].cells[j].childNodes[0].value;
                    listSecond = Number(listTime.substr(0, 2)) * 3600 + Number(listTime.substr(3, 2)) * 60;

                    if (listSecond < 10800) {
                        listSecond = listSecond + 86400;
                    }
                    t55 = listSecond + 55 * 60;
                    t60 = listSecond + 60 * 60;

                    if (seconds >= t60) {
                        tbList.rows[i + 1].cells[j].childNodes[0].style.backgroundColor = "green";
                    } else if (seconds > t55) {
                        tbList.rows[i + 1].cells[j].childNodes[0].style.backgroundColor = "red";
                    } else if (seconds == t55) {
                        PlaySound();
                        tbList.rows[i + 1].cells[j].childNodes[0].style.backgroundColor = "red";
                    } else {
                        tbList.rows[i + 1].cells[j].childNodes[0].style.backgroundColor = "";
                    }

                    switch (tbList.rows[i + 1].cells[j - 1].childNodes[0].value) {
                        case '青':
                            tbList.rows[i + 1].cells[j - 1].childNodes[0].style.backgroundColor = "blue";
                            break;
                        case '黄':
                            tbList.rows[i + 1].cells[j - 1].childNodes[0].style.backgroundColor = "yellow";
                            break;
                        case '赤':
                            tbList.rows[i + 1].cells[j - 1].childNodes[0].style.backgroundColor = "red";
                            break;
                        case '玉':
                            tbList.rows[i + 1].cells[j - 1].childNodes[0].style.backgroundColor = "green";
                            break;
                        case '土':
                            tbList.rows[i + 1].cells[j - 1].childNodes[0].style.backgroundColor = "green";
                            break;
                        case '竜':
                            tbList.rows[i + 1].cells[j - 1].childNodes[0].style.backgroundColor = "green";
                            break;
                    }
                }
            }
        }
    }, 1000);
}

socket.on('init', (data) => {

    console.log(data);
    TimeListG = data.a;
    TimeListY = data.b;
    TimeListS = data.c;
    let hour, minute;

    for (let i = 0; i < 40; i++) {

        tbList.rows[i + 1].cells[0].childNodes[0].setAttribute('value', TimeListG[i].no);
        tbList.rows[i + 1].cells[1].childNodes[0].setAttribute('value', TimeListG[i].type);
        tbList.rows[i + 1].cells[2].childNodes[0].setAttribute(
            'value', TimeListG[i].hourTime + ':' + TimeListG[i].minuteTime);
        tbList.rows[i + 1].cells[3].childNodes[0].setAttribute('value', TimeListY[i].type);
        tbList.rows[i + 1].cells[4].childNodes[0].setAttribute(
            'value', TimeListY[i].hourTime + ':' + TimeListY[i].minuteTime);
        tbList.rows[i + 1].cells[5].childNodes[0].setAttribute('value', TimeListS[i].type);
        tbList.rows[i + 1].cells[6].childNodes[0].setAttribute(
            'value', TimeListS[i].hourTime + ':' + TimeListS[i].minuteTime);
    }
});

socket.on('allSetTime', (data) => {

    tbList.rows[data.serverNo].cells[Number(data.area)].childNodes[0].setAttribute('value', data.type);
    tbList.rows[data.serverNo].cells[Number(data.area) + 1].childNodes[0].setAttribute(
        'value', data.hourTime + ':' + data.minuteTime);
});

let hankaku2Zenkaku = (str) => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

let PlaySound = () => {
    audioElem = new Audio();
    audioElem.src = "htdocs/1.wav";
    audioElem.play();
}