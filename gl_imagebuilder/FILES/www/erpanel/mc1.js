var mc1_vol_current = -1;
var mc1_vol_new = -1;
var mc1_vol_new_ts = -1;

var mc1_checkSlider = function (val, onNewVal) {
	//  check new slider vol  //
    if(val != mc1_vol_new && mc1_vol_new != -1) {
        mc1_vol_new = val;
        mc1_vol_new_ts = Date.now();
    }
    //  check timeout since last movement  //
    if(mc1_vol_new_ts != -1 && Date.now() - mc1_vol_new_ts > 500) {
        mc1_vol_new_ts = -1;
        onNewVal(mc1_vol_new);
    }
}

var mc1_checkMsg = function (recievedVol, onNewSlider, onNewVolume) {
	//  check slider was not in use  //
	if(mc1_vol_new == -1) {
	    mc1_vol_new = recievedVol;
	    onNewSlider(mc1_vol_new);
	}
	//  slider was in use  //
	else {
	    //  check new vol recieved  //
	    if(recievedVol != mc1_vol_current) {
	        //  save and show  //
	        mc1_vol_current = recievedVol;
	        onNewVolume(mc1_vol_current);

	        //  check need to set slider  //
	        if(mc1_vol_new_ts == -1 && recievedVol != mc1_vol_new) {
	        	mc1_vol_new = recievedVol;
	        	onNewSlider(mc1_vol_new);
	        }
	    }
	}
}