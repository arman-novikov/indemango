var gamePeriod_min = 60;

var gamesList = [];

var gamesList_getByNumber = function(num) {
    for(var i = 0; i < gamesList.length; ++i) {
        if(gamesList[i].number == num) {
            return gamesList[i];
        }
    }

    return null;
}

var gamesList_sort = function() {
	//  sort by strId  //
    gamesList.sort(function(a, b){
        if(parseInt(a.start_ts) < parseInt(b.start_ts)) return 1;
        if(parseInt(a.start_ts) > parseInt(b.start_ts)) return -1;
        return 0;
    });
}

