var riddlesInfo = [];

var riddlesInfo_getByStrId = function(strId) {
    for(var i = 0; i < riddlesInfo.length; i++) {
        if(riddlesInfo[i].strId == strId) {
            return riddlesInfo[i];
        }
    }

    return null;
}

var riddlesInfo_add = function(obj, onAdded, onUpdated) {

    //  check is not already exist  //
    var riddle = riddlesInfo_getByStrId(obj.strId)
    if(riddle == null) {
        //  add ts  //
        obj.lastUdateTS = Date.now();
        // logs_log(obj.lastUdateTS.toString());

        //  add new  //
        riddlesInfo.push(obj);

        //  sort riddles  //
        riddlesInfo.sort(function(a, b){
            if(parseInt(a.number) < parseInt(b.number)) return -1;
            if(parseInt(a.number) > parseInt(b.number)) return 1;
            return 0;
        });

        onAdded(obj);
    }

    //  riddle already exist  //
    else {
        //  add ts  //
        riddle.lastUdateTS = Date.now();
        // logs_log(obj.lastUdateTS.toString());

        // logs_log('---' + riddle.strName + ': ' + riddle.lastUdateTS.toString() + ' ms');

        //  check new status  //
        if(riddle.strStatus != obj.strStatus) {
            //  save it  //
            riddle.strStatus = obj.strStatus;

            onUpdated(obj);
        }
    } 
}