var mc2_vol_current = -1;
var mc2_vol_new = -1;
var mc2_vol_new_ts = -1;

var mc2_checkSlider = function (val, onNewVal) {
	//  check new slider vol  //
    if(val != mc2_vol_new && mc2_vol_new != -1) {
        mc2_vol_new = val;
        mc2_vol_new_ts = Date.now();
    }
    //  check timeout since last movement  //
    if(mc2_vol_new_ts != -1 && Date.now() - mc2_vol_new_ts > 500) {
        mc2_vol_new_ts = -1;
        onNewVal(mc2_vol_new);
    }
}

var mc2_checkMsg = function (recievedVol, onNewSlider, onNewVolume) {
	//  check slider was not in use  //
	if(mc2_vol_new == -1) {
	    mc2_vol_new = recievedVol;
	    onNewSlider(mc2_vol_new);
	}
	//  slider was in use  //
	else {
	    //  check new vol recieved  //
	    if(recievedVol != mc2_vol_current) {
	        //  save and show  //
	        mc2_vol_current = recievedVol;
	        onNewVolume(mc2_vol_current);

	        //  check need to set slider  //
	        if(mc2_vol_new_ts == -1 && recievedVol != mc2_vol_new) {
	        	mc2_vol_new = recievedVol;
	        	onNewSlider(mc2_vol_new);
	        }
	    }
	}
}
