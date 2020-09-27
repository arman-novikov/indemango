var soundList = [];

var soundList_getByStrId = function(strId) {
    for(var i = 0; i < soundList.length; i++) {
        if(soundList[i].strId == strId) {
            return soundList[i];
        }
    }

    return null;
}

var soundList_add = function(obj, onSuccess) {

    //  check is not already exist  //
    var sound = soundList_getByStrId(obj.strId)
    if(sound == null) {
        //  add new  //
        soundList.push(obj);

        //  sort by strId  //
        soundList.sort(function(a, b){
            if(parseInt(a.strId) < parseInt(b.strId)) return -1;
            if(parseInt(a.strId) > parseInt(b.strId)) return 1;
            return 0;
        });

        onSuccess(obj);
    }
}
