var On_Plate = [];  
var count = 0;

class Yakiniku{
    constructor(name, x_point, y_point, timer, imgpath){
        this.name = name;
        this.x_point = x_point;
        this.y_point = y_point;
        this.timer = timer;
        this.recordtime = timer;
        this.imgpath = imgpath;
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
    var value1 = document.getElementById('select1');
    var value3 = document.getElementById('select3');
    var value4 = document.getElementById('select4');
    var value5 = document.getElementById('select5');
    var value2 = document.getElementById('select2');
    CreateImage(value1, value2);
    CreateImage(value3, value2);
    CreateImage(value4, value2);
    CreateImage(value5, value2);
}

//CreateImage 焼くボタンを押したときに実行される関数
function CreateImage(value, burntype){
    if(value.values!="選択なし"){        
    // 乱数配置用の処理
    //xpointの値を設定する
    var items = [1, 70, 140, 210, 280, 350, 420, 490];
    //最大値は配列の「要素数」にする
    var xrandom = Math.floor( Math.random() * items.length );
    console.log( items[xrandom]);

    //ypointの値を設定する
    var items = [1, 70, 140, 210, 280, 350, 420, 490, 560, 630];
    var a = items.length;
    //シャフル
    while (a) {
        var j = Math.floor( Math.random()*a);
        var t = items[--a];
        items[a] = items[j];
        items[j] = t;
    }
    var yrandom = Math.floor( Math.random()*items.length);
    console.log( items[xrandom]);
        var xpoint = xrandom;
        var ypoint = yrandom;
        console.log(csvData[value.value]["rareimgpath"]);
        On_Plate[count] = new Yakiniku(value.value, xpoint, ypoint, csvData[value.value][value2.value], csvData[value.value]["rareimgpath"]);
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
                ctx.font = "30px serif";                                        
                ctx.fillText(csvData[value.value][burntype.value], xpoint+w/2, ypoint+h/2);
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
                   if(Yakiniku_Object.imgpath==csvData[Yakiniku_Object.name]["rareimgpath"]){
                       if(csvData[Yakiniku_Object.name]["burnimgpath"]==""){
                            Yakiniku_Object.imgpath=csvData[Yakiniku_Object.name]["rareimgpath"]                            
                       }else{
                            Yakiniku_Object.imgpath=csvData[Yakiniku_Object.name]["burnimgpath"]                           
                       }
                       Yakiniku_Object.time = parseInt(Yakiniku_Object.recordtime/2);
                   }else if(Yakiniku_Object.imgpath==csvData[Yakiniku_Object.name]["burnimgpath"]){
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
                    var permit = "　　　";
                    var permit_font_counter = 0;
                    if(Yakiniku_Object.timer<=5 && Yakiniku_Object.imgpath==csvData[Yakiniku_Object.name]["rareimgpath"]){
                        permit = "ひっくり返してください\n";
                        permit_font_counter = 10;
                    }else if(Yakiniku_Object.timer<=5 && Yakiniku_Object.imgpath==csvData[Yakiniku_Object.name]["burnimgpath"]){
                        permit = "焼きあがりました。\n";
                        permit_font_counter = 10;                        
                    }else if(permit_font_counter <= 0){
                        permit = "\n";
                    }else{
                        permit_font_counter--;                        
                    }
                    
                    if(s<10){
                        var time = permit + min + ':0' + s;    
                    }
                    else{
                        var time = permit + min + ':' + s;   
                    }

                    ctx.fillText(time , Yakiniku_Object.x_point+20, Yakiniku_Object.y_point+30);
                }, false);
            }, false);       

        }); 
    console.log(On_Plate);
}

setInterval(log, 1000);


