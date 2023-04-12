function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);;
}

function getFileID(FileNameString){
  var FileIterator = DriveApp.getFilesByName(FileNameString);
  while (FileIterator.hasNext()){
    var file = FileIterator.next();
    if (file.getName() == FileNameString){
      return file.getId();
    }    
  }
}

function getAllData(){
  var ss = SpreadsheetApp.openById(getFileID(mutableInfoDict.publicSheet));
  var go = true;
    var num = 1;
    while (go){
      var vals = ss.getRange(`Compiled_Data!A${num}:B${num}`).getValues();
      if (vals[0][0] != "" && vals[0][1] != ""){
        num++;
      } else {
        go = false;
      }
    }

  return ss.getRange(`Compiled_Data!A:B`).getValues().splice(0, num-1);
}

function getParsedData(){
  var data = getAllData();
  betterData = []
  for (var i = 1; i < data.length; i++ ){
    betterData.push(data[i][0] + ", " + data[i][1]);
  }
  return [betterData, mutableInfoDict.general_events, mutableInfoDict.priority_events];
}

function submitInfo(data){
    var ss = SpreadsheetApp.openById(getFileID(mutableInfoDict.publicSheet));
    var go = true;
    var num = 1;
    while (go){
      var vals = ss.getRange(`Forms!A${num}:J${num}`).getValues();
      if (vals[0][0] != "" && vals[0][1] != ""){
        num++;
      } else {
        go = false;
      }
    }

    var currentDate = new Date().toJSON().slice(0, 10);
    var email = data[0];
    var lName = data[1].split(", ")[0];
    var fName = data[1].split(", ")[1];
    var workerName = data[2];
    var workedDate = data[3];
    var hoursWorked = data[5];
    var workDone = data[6];
    var workDescription = data[4];
    var typeWorked = data[7];

    ss.getRange(`Forms!A${num}:J${num}`).setValues([[currentDate, lName, fName, email, workedDate, workerName, typeWorked, workDone, hoursWorked, workDescription]]);

    //rescanAndRefactor();
}

function rescanAndRefactor(){
  var ss = SpreadsheetApp.openById(getFileID(mutableInfoDict.publicSheet));

  let myData = getAllData();
  Logger.log(myData[0])
  for (var i in myData){
    Logger.log(i);
    i.push(0);
    i.push(0);
    var go = true;
    var num = 2;
    while (go){
      var vals = ss.getRange(`Forms!A${num}:J${num}`).getValues();
      if (vals[0][2] != "" && vals[0][1] != ""){
        num++;
        if (vals[0][1] != i[0] && vals[0][2] != i[1]){
          if (vals[0][6] == "General"){
            i[2] += vals[0][8]
          } else {
            i[3] += vals[0][8]
          }
        }
      } else {
        go = false;
      }
    }
  }
  Logger.log(myData);
}


