var On_Plate = [];  
var count = 0;

class Yakiniku{
    constructor(name, x_point, y_point, timer, imgpath){
        this.name = name;
        this.x_point = x_point;
        this.y_point = y_point;
        this.timer = timer;
        this.rareimgpath = imgpath;
    }

    // timer 10s毎に処理を行う
    Advance_timer(){
        this.timer = this.timer-1;
        return this.timer;                                        
    }
}

// CSVファイルから読み取ったデータを連想配列化する関数
var csvData = {};
function csvToArray(path) {                                
    var data = new XMLHttpRequest();        
    data.open("GET", path, false);
    data.send(null);
    var LF = String.fromCharCode(10);
    var lines = data.responseText.split(LF);
    for (var i = 0; i < lines.length; ++i) {
            var cells = lines[i].split(",");        
            csvData[decodeURIComponent(cells[0]).toString()] = {"rare":cells[1], "medium":cells[2], "welldone":cells[3], "rareimgpath":cells[4], "burnimgpath":cells[5]};
    }
    console.log(csvData);
    return csvData;
}

// ページロード時に実行
window.onload=function () {
    console.log('hello');
    csvToArray("yakiniku3.csv");

    var canvas = document.getElementById('cvs1');
    var ctx = canvas.getContext('2d');

    var image = new Image();
    image.src = "./images/ami.png";
    image.addEventListener('load', function() {
        ctx.drawImage(image, 0, 0, 560, 700);
    }, false);
}

// 選択タグを押した後「焼く」ボタンを押したとき実行する関数
function imageDraw() {
    var value = document.getElementById('select1');
    console.log(value.value);
    if(value.values != "選択なし"){
        var xpoint = 0;
        var ypoint = 0;
        
        console.log(csvData[value.value]["rareimgpath"]);

        On_Plate[count] = new Yakiniku(value.value, xpoint, ypoint, csvData[value.value]["medium"], imgpath = csvData[value.value]["rareimgpath"]);                     

    /* ------------ 画像生成　------------ */
        var w = 60;
        var h = 60;
        var canvas = document.getElementById('cvs1');
        var ctx = canvas.getContext('2d');                                        
        var image = new Image();
        image.src = "./images/ami.png";
        image.addEventListener('load', function() {
            ctx.drawImage(image, 0, 0, 560, 700);
            var img2 = new Image();
            img2.src = csvData[value.value]["rareimgpath"];
            img2.addEventListener('load', function() {
                ctx.drawImage(img2, xpoint, ypoint, w, h);
                ctx.font = "20px serif";                                        
                ctx.fillText(csvData[value.value]["medium"], xpoint+w/2, ypoint+h/2);
            }, false);
        }, false);

    /* ------------ 画像生成　------------ */

        count+=1;
    }
}

// 10s 毎に実行する関数
var log = function(){
    idx = 0

    var w = 60;
    var h = 60;
    var canvas = document.getElementById('cvs1');
    var ctx = canvas.getContext('2d');                                        
    var image = new Image();
    image.src = "./images/ami.png";
    image.addEventListener('load', function() {
        ctx.clearRect(0, 0, 560, 700);
        ctx.drawImage(image, 0, 0, 560, 700);

            // 普通のfor文に直す,エラー普及のために
            On_Plate.forEach(function(Yakiniku_Object){
               time = Yakiniku_Object.Advance_timer()
               if(time<=0){
                   if(Yakiniku_Object.imgpath==csvData[value.value]["rareimgpath"]){
                       Yakiniku_Object.imgpath==csvData[value.value]["burnimgpath"]
                   }else if(Yakiniku_Object.imgpath==csvData[value.value]["burnimgpath"]){
                        count--;
                        On_Plate.splice(idx,1);
                   }
               }else{
                   idx++;
               }
                var img2 = new Image();
                img2.src =Yakiniku_Object.imgpath;
                img2.addEventListener('load', function() {
                    ctx.drawImage(img2, Yakiniku_Object.x_point, Yakiniku_Object.y_point, w, h);

                    ctx.font = "30px serif";
                    min = parseInt(Yakiniku_Object.timer/60);
                    s =  parseInt(Yakiniku_Object.timer - 60 * min);
                    if(s<10){
                        var time = min + ':0' + s;    
                    }
                    else{
                        var time = min + ':' + s;   
                    }

                    ctx.fillText(time , Yakiniku_Object.x_point+20, Yakiniku_Object.y_point+30);
                }, false);
            }, false);       

        }); 
    console.log(On_Plate);
}

setInterval(log, 1000);


