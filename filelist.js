var fs = require("fs");
var Excel = require('exceljs');
var path = require("path")

function walk(dir) {  
    var children = []  
    fs.readdirSync(dir).forEach(function(filename){  
        var path = dir+"/"+filename  
        var stat = fs.statSync(path)  
        if (stat && stat.isDirectory()) {  
            children = children.concat(walk(path))  
        }  
        else {  
            children.push(path)  
        }  
    })  
  
    return children  
}  

function writeExcel(data) {
    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('已完成');
    data.forEach(function(e){  
         sheet.addRow([e]);
    });
    workbook.xlsx.writeFile("filelist.xlsx")
    .then(function() {
        // done
    });
}

var fp=fs.readFileSync(path.join(process.cwd(), "./dirconfig.js"),"utf-8"); 
eval(fp)  \\fp="C:\\个人文件夹\\liweijian"
console.log(fp)  
var files = walk(fp)
writeExcel(files)
