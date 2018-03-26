var fs = require("fs");
var Excel = require('exceljs');
var path = require("path")
var iconv = require('iconv-lite');   

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

function findnewestlogfile(dir) {  
    var newestfilepath
    var newestmtime = new Date("2009/1/1")
    fs.readdirSync(dir).forEach(function(filename){  
        var path = dir+"/"+filename  
        var stat = fs.statSync(path)  
        if(stat.mtime.getTime() - newestmtime.getTime() > 0 && path.indexOf(".txt") > 0) {
            newestmtime = stat.mtime
            newestfilepath = path
        }
    })  
    return newestfilepath  
}  


function writeExcelArray(data) {
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

function writeExcelMap(data) {
    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('已完成');
    var sheet2 = workbook.addWorksheet('未完成');
    // console.log(typeof data)
    var keys = Object.keys(data)
    keys.forEach(function(e) {
         var value = data[e]
         if(value["done"]) {
            sheet.addRow([value["ztbh"], value["ztname"], e, "已发送"])
         }else{
            sheet2.addRow([value["ztbh"], value["ztname"], e, "未发送"])
         }
    })
    workbook.xlsx.writeFile("发送情况统计.xlsx")
    .then(function() {
        // done
    });
}

function readlogfile(path) {
    var fileStr = fs.readFileSync(path, {encoding:'binary'});
    var buf = new Buffer(fileStr, 'binary');
    var str = iconv.decode(buf,'gbk');
    var lines = str.split(/\r\n/ig)
    var sendlines = lines.filter(function(item) {
        if(item.indexOf("完成收信人为") > 0 || item.indexOf("----发送的文件为") > 0) {
            return true
        }
    });  

    for(var i=0;i<sendlines.length;i=i+2){
        var index1 = sendlines[i].indexOf("完成收信人为") + 7
        var value1 = sendlines[i].slice(index1,sendlines[i].length-1)
        if(allproductmap[value1]!=undefined) {
            allproductmap[value1]["done"] = true
        }
       
    }

}

function readallproduct(path, cb){
    // read from a file
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(path)
        .then(function() {
            // use workbook
            var worksheet = workbook.getWorksheet('Sheet1');
            worksheet.eachRow(function(row, rowNumber) {
                if (row.values[6] != null && row.values[6].hasOwnProperty("text")) {
                    key = row.values[6].text
                    if(key != undefined) {
                        key = key.replace(/(^\s*)|(\s*$)/g, "")
                        allproductmap[key] = {
                        "ztbh":row.values[1]!=undefined?row.values[1]:"",
                        "ztname":row.values[3]!=undefined?row.values[3]:"",
                        "done":false
                     }
                    }              
                }            
            });

            cb()
        });

}

var walkdir=""
var allproduct=""
var logdir=""
allproductmap={}


var dirconfig=fs.readFileSync(path.join(process.cwd(), "./dirconfig.js"),"utf-8"); 
eval(dirconfig)

readallproduct(allproduct, function() {
    readlogfile(findnewestlogfile(logdir))
    writeExcelMap(allproductmap)
})
