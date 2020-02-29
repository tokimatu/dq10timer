let socket = io();
let tbList = document.getElementById("tableList");
let audioElem;
console.log(tbList.childNodes[1]);
tbList.rows[1].cells[0].innerText = "1";
for (let i = 1; i < 20; i++) {
    tbList.childNodes[1].appendChild(tbList.rows[1].cloneNode(true));
    tbList.childNodes[1].lastChild.cells[0].innerText = i + 1;
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

for (let i = 0; i < 20; i++) {
    tbList.rows[i + 1].cells[0].innerText = TimeListG[i].no;
    tbList.rows[i + 1].cells[1].innerText = TimeListG[i].type;
    tbList.rows[i + 1].cells[2].innerText = TimeListG[i].hourTime + ":" + TimeListG[i].minuteTime;
    tbList.rows[i + 1].cells[3].innerText = TimeListY[i].type;
    tbList.rows[i + 1].cells[4].innerText = TimeListY[i].hourTime + ":" + TimeListY[i].minuteTime;
    tbList.rows[i + 1].cells[5].innerText = TimeListS[i].type;;
    tbList.rows[i + 1].cells[6].innerText = TimeListS[i].hourTime + ":" + TimeListS[i].minuteTime;
    tbList.rows[i + 1].cells[7].innerText = TimeListG[i + 20].no;
    tbList.rows[i + 1].cells[8].innerText = TimeListG[i + 20].type;
    tbList.rows[i + 1].cells[9].innerText = TimeListG[i + 20].hourTime + ":" + TimeListG[i + 20].minuteTime;
    tbList.rows[i + 1].cells[10].innerText = TimeListY[i + 20].type;
    tbList.rows[i + 1].cells[11].innerText = TimeListY[i + 20].hourTime + ":" + TimeListY[i + 20].minuteTime;
    tbList.rows[i + 1].cells[12].innerText = TimeListS[i + 20].type;;
    tbList.rows[i + 1].cells[13].innerText = TimeListS[i + 20].hourTime + ":" + TimeListS[i + 20].minuteTime;
}

window.onload = () => {
    document.form1.serverNo.focus();

    //socket.justify-content-around
    socket.emit('join', {
        roomid: 'namitatsu'
    });

    document.getElementById("updateBtn").addEventListener("click", () => {
        let serverNo = hankaku2Zenkaku(document.form1.serverNo.value);
        document.form1.serverNo.value = "";
        let areaNo = document.form1.area.selectedIndex;
        document.form1.area.selectedIndex = 0;
        let area = document.form1.area.options[areaNo].value;
        let typeNo = document.form1.type.selectedIndex;
        document.form1.type.selectedIndex = 0;
        let type = document.form1.type.options[typeNo].value;

        let now = new Date();
        let hour = ('00' + now.getHours()).slice(-2);
        let minute = ('00' + now.getMinutes()).slice(-2);
        let seconds = hour * 3600 + minute * 60;

        if (isNaN(serverNo) || serverNo == "" || serverNo < 1 || serverNo > 40) {
            console.error("サーバー番号が不正です。");
            alert("数値を入力してください。");
            return;
        } else if (!areaNo || !typeNo) {
            console.error("種類か場所が不正です。");
            alert("種類と場所を選択してください。");
            return;
        }

        socket.emit('setTimeType', {
            serverNo: serverNo,
            type: type,
            minuteTime: minute,
            hourTime: hour,
            area: area
        });
        document.form1.serverNo.focus();
    });

    const targetsA = document.getElementsByClassName("A");
    for (let i = 0; i < targetsA.length; i++) {
        targetsA[i].addEventListener("click", (e) => {

            //おまえ、何番目の要素じゃい！！
            let parent = e.target.parentNode
            let children = parent.children;
            let eles = [].slice.call(children);
            console.log(eles.indexOf(e.target));
            console.log(parent.cells[0].innerText);
            let serverNo = parent.cells[0].innerText;
            let area = eles.indexOf(e.target);
            if (area > 9) {
                area = type - 7;
            }


            if (e.target.innerText != "") {
                let res = window.confirm(e.target.innerText + "と" +
                    e.target.nextElementSibling.innerText + "を削除しますか？");
                if (res == true) {
                    e.target.innerText = "";
                    e.target.nextElementSibling.style.backgroundColor = "";
                    e.target.nextElementSibling.innerText = ":";
                    socket.emit('setTimeType', {
                        serverNo: serverNo,
                        type: "",
                        minuteTime: "",
                        hourTime: "",
                        area: area
                    });
                }
            }
        });
    }

    const targetsB = document.getElementsByClassName("B");
    for (let i = 0; i < targetsB.length; i++) {
        targetsB[i].addEventListener("click", (e) => {
            //おまえ、何番目の要素じゃい！！
            let parent = e.target.parentNode
            let children = parent.children;
            let eles = [].slice.call(children);
            console.log(eles.indexOf(e.target));
            console.log(parent.cells[0].innerText);
            let serverNo = parent.cells[0].innerText;
            let area = eles.indexOf(e.target) - 1;
            if (area > 8) {
                area = type - 7;
            }

            if (e.target.innerText != ":") {
                let res = window.confirm(e.target.previousElementSibling.innerText + "と" +
                    e.target.innerText + "を削除しますか？");
                if (res == true) {
                    e.target.innerText = ":";
                    e.target.previousElementSibling.innerText = "";
                    e.target.previousElementSibling.style.backgroundColor = "";
                    socket.emit('setTimeType', {
                        serverNo: serverNo,
                        type: "",
                        minuteTime: "",
                        hourTime: "",
                        area: area
                    });
                }
            }
        });
    }

    setInterval(() => {
        let now = new Date();
        let second = now.getSeconds();

        if (second == 0) {
            let hour = now.getHours();
            let minute = now.getMinutes();
            let seconds = hour * 3600 + minute * 60;
            let listTime = [];
            let listSecond = [];
            let t55 = [],
                t60 = [];

            if (seconds < 14400) {
                seconds = seconds + 86400;
            }

            for (let i = 0; i < 20; i++) {

                for (let j = 2; j <= 6; j = j + 2) {
                    listTime[0] = tbList.rows[i + 1].cells[j].innerText;
                    listTime[1] = tbList.rows[i + 1].cells[j + 7].innerText;

                    for (let k = 0; k < 2; k++) {
                        listSecond[k] = Number(listTime[k].substr(0, 2)) * 3600 + Number(listTime[k].substr(3, 2)) * 60;

                        if (listSecond[k] < 10800) {
                            listSecond[k] = listSecond[k] + 86400;
                        }

                        t55[k] = listSecond[k] + 55 * 60;
                        t60[k] = listSecond[k] + 60 * 60;

                        if (seconds >= t60[k]) {
                            tbList.rows[i + 1].cells[j + k * 7].style.backgroundColor = "green";
                        } else if (seconds > t55[k]) {
                            tbList.rows[i + 1].cells[j + k * 7].style.backgroundColor = "red";
                        } else if (seconds == t55[k]) {
                            PlaySound();
                            tbList.rows[i + 1].cells[j + k * 7].style.backgroundColor = "red";
                        } else {
                            tbList.rows[i + 1].cells[j + k * 7].style.backgroundColor = "";
                        }

                        switch (tbList.rows[i + 1].cells[j + k * 7 - 1].innerText) {
                            case '青':
                                tbList.rows[i + 1].cells[j + k * 7 - 1].style.backgroundColor = "blue";
                                break;
                            case '黄':
                                tbList.rows[i + 1].cells[j + k * 7 - 1].style.backgroundColor = "yellow";
                                break;
                            case '赤':
                                tbList.rows[i + 1].cells[j + k * 7 - 1].style.backgroundColor = "red";
                                break;
                            case '玉':
                                tbList.rows[i + 1].cells[j + k * 7 - 1].style.backgroundColor = "green";
                                break;
                            case '土':
                                tbList.rows[i + 1].cells[j + k * 7 - 1].style.backgroundColor = "green";
                                break;
                            case '竜':
                                tbList.rows[i + 1].cells[j + k * 7 - 1].style.backgroundColor = "green";
                                break;
                        }
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

    for (let i = 0; i < 20; i++) {

        tbList.rows[i + 1].cells[0].innerText = TimeListG[i].no;
        tbList.rows[i + 1].cells[1].innerText = TimeListG[i].type;
        tbList.rows[i + 1].cells[2].innerText = TimeListG[i].hourTime + ':' + TimeListG[i].minuteTime;
        tbList.rows[i + 1].cells[3].innerText = TimeListY[i].type;
        tbList.rows[i + 1].cells[4].innerText = TimeListY[i].hourTime + ':' + TimeListY[i].minuteTime;
        tbList.rows[i + 1].cells[5].innerText = TimeListS[i].type;
        tbList.rows[i + 1].cells[6].innerText = TimeListS[i].hourTime + ':' + TimeListS[i].minuteTime;
        tbList.rows[i + 1].cells[7].innerText = TimeListG[i + 20].no;
        tbList.rows[i + 1].cells[8].innerText = TimeListG[i + 20].type;
        tbList.rows[i + 1].cells[9].innerText = TimeListG[i + 20].hourTime + ":" + TimeListG[i + 20].minuteTime;
        tbList.rows[i + 1].cells[10].innerText = TimeListY[i + 20].type;
        tbList.rows[i + 1].cells[11].innerText = TimeListY[i + 20].hourTime + ":" + TimeListY[i + 20].minuteTime;
        tbList.rows[i + 1].cells[12].innerText = TimeListS[i + 20].type;;
        tbList.rows[i + 1].cells[13].innerText = TimeListS[i + 20].hourTime + ":" + TimeListS[i + 20].minuteTime;
    }
});

socket.on('allSetTime', (data) => {
    console.log(data);

    let serverNo = data.serverNo;
    let color = setColor(data.type);

    if (serverNo < 21) {
        tbList.rows[serverNo].cells[Number(data.area)].innerText = data.type;
        tbList.rows[serverNo].cells[Number(data.area)].style.backgroundColor = color;
        tbList.rows[serverNo].cells[Number(data.area) + 1].innerText = data.hourTime + ':' + data.minuteTime;
    } else {
        tbList.rows[serverNo - 20].cells[Number(data.area) + 7].innerText = data.type;
        tbList.rows[serverNo - 20].cells[Number(data.area)].style.backgroundColor = color;
        tbList.rows[serverNo - 20].cells[Number(data.area) + 8].innerText = data.hourTime + ':' + data.minuteTime;
    }


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

let setColor = (data) => {
    let color;
    switch (data) {
        case '黄':
            color = 'yellow';
            break;
        case '青':
            color = 'blue';
            break;
        case '赤':
            color = 'red';
            break;
        case '玉':
        case '土':
        case '竜':
            color = 'green';
            break;
    }
    return color;
}