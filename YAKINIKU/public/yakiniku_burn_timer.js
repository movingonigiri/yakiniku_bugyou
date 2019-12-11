function main(path) {
    var csvData = new Array();
    var data = new XMLHttpRequest();
    data.open("GET", path, false);
    data.send(null);
    var LF = String.fromCharCode(10);
    var lines = data.responseText.split(LF);
    
    for (var i = 0; i < lines.length;++i) {
        var cells = lines[i].split(",");
        if( cells.length != 1 ) {
            csvData.push(cells);
        }
    }
    return csvData;
}

var req;
  if( window.XMLHttpRequest){
    req = new XMLHttpRequest();
  }else if(window.ActiveXObject){
    try {
      req = new ActiveXObject("MSXML2.XMLHTTP");
    } catch (e) {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  if (req) {
    req.open('GET', 'http://www.example.com/contents.txt');
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        document.write(req.responseText);
      }
    }
    req.send(null);
  }

var path = "./yakiniku.csv";
main(path)