let video;
let yolo;
let status;
let objects = [];

function setup() {
    // ドキュメント内にcanvas要素を作成し、サイズをピクセル単位で設定する。
    // https://p5js.org/reference/#/p5/createCanvas
    createCanvas(320, 240);
    // Webカメラからのオーディオ/ビデオを含む新しいHTML5 video要素を作成する
    // https://p5js.org/reference/#/p5/createCapture
    video = createCapture(VIDEO);
    // ビデオのサイズはキャンバスと同じ
    video.size(320, 240);

    // YOLOオブジェクトを作成する
    yolo = ml5.YOLO(video, startDetecting);

    // 元のビデオは隠す
    video.hide();
    status = select('#status');
}

// 毎フレーム、p5.jsによって呼び出される。
function draw() {
    // イメージをp5.jsのcanvasに描画する。
    // image(img, x, y, [width], [height])
    // https://p5js.org/reference/#/p5/image

    // width: 描画するキャンバスの幅を保持するシステム変数。heightも同様
    image(video, 0, 0, width, height);

    for (let i = 0; i < objects.length; i++) {
        noStroke();
        fill(0, 255, 0);
        // クラス名を境界ボックス左上に描く
        // 画面にテキストを描画する。最初のパラメータで指定された情報を、以降の追加パラメータで指定された位置の画面に表示する。
        // text(str, x, y, [x2], [y2])
        // https://p5js.org/reference/#/p5/text
        text(objects[i].className, objects[i].x * width, objects[i].y * height - 5);
        noFill();
        strokeWeight(4);
        stroke(0, 255, 0);
        // 境界ボックスを描く
        // 矩形を画面に描画する。
        // rect(x, y, w, h, [tl], [tr], [br], [bl])
        // https://p5js.org/reference/#/p5/rect
        rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
    }
}

function startDetecting() {
    status.html('モデルを読み込んだ');
    detect();
}

// ビデオからのイメージを物体検出する
function detect() {
    yolo.detect(function (err, results) {
        // 結果を配列objectsに割り当てる
        objects = results;
        // 連続して検出
        detect();
    });
}