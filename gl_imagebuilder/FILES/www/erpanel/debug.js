var MQTT_ADDR = "192.168.10.1";
var MQTT_PORT = 8080;

//  to access not in local network  //
MQTT_ADDR = window.location.host;

riddleName = "None";
riddleTS = 0;

var controlItems = [];

var controlItems_types = function() {
    return ["dout", "din", "cpz"];
}

var controlItems_show = function() {
    var res = "<div>";
    for(var i = 0; i < controlItems.length; i++) {
        res += controlItem_str(controlItems[i]);
    }
    res += "</div>";

    $("#controls").html(res);
}

var controlItem_str = function(controlItem) {
    var res = "<div>";
    res += '    <select class="form-control">';
    for(var i = 0; i < controlItems_types().length; i++) {
        res += '<option value="' + controlItems_types()[i] + '"';
        if(controlItems_types()[i] == controlItem.type) {
            res += ' selected';
        }
        res += '>'; 
        res += controlItems_types()[i]; 
        res += '</option>';
    }
    res += '    </select>';
    res += '<input id="pins_0" type="text" name="itemname" value="4" class="form-control">';
    res += "</div>";
    
    return res;

    // <div>
    //    <select class="form-control">
    //        <option value="ledstrip">Ledstrip</option>
    //        <option value="cpz">CPZ</option>
    //    </select>
    //    <input type="text" name="itemname" value="4" class="form-control">
    //    <button onclick="ui_blockRiddleEdit_onCancel()" type="button" class="btn btn-default">Test</button>
    // </div>
}

var timerGlobal = setInterval(function() {
    if(Date.now() / 1000 - riddleTS > 2) {
    	riddleName = "None";
    	$("#riddlename").html("Riddle: <span style='color: gray'>" + riddleName + "</span>");
    }
}, 1000);

//  on ready  //
$(document).ready(function(){

    mqtt_connect();

    controlItems.push({type: "dout", pins: 11, value: 1});
    controlItems_show();
});

var ui_onAdd = function() {
    controlItems.push({type: "dout", pins: 10, value: 0});
    controlItems_show();
}

//
//  mqtt  //
//

var clientId = "id_" + parseInt(Math.random() * 1000, 10);
var client = new Messaging.Client(MQTT_ADDR, MQTT_PORT, clientId);
var options = {
    timeout: 3,
    onSuccess: function() {
        // logs_log('MQTT: Connected: ' + MQTT_ADDR + ':' + MQTT_PORT + ', id: ' + clientId);

        //  ping  //
        mqtt_subscribe('/debug/ping'); 

        // //  riddles  //
        // mqtt_subscribe('/er/riddles/info');
        // logs_log('MQTT: Subscribed: ' + '/er/riddles/info');
    },
    onFailure: function(message) {
        // logs_log('Error: MQTT: Connection: ' + MQTT_ADDR + ':' + MQTT_PORT + ': ' + message.errorMessage);
    }
};

client.onConnectionLost = function(responseObject) {
    alert("Connection lost: Please, press OK, and wait for reboot (" + responseObject.errorMessage + ")");
    location.reload();
};

client.onMessageArrived = function(message) {
    // logs_log('MQTT: Topic: ' + message.destinationName + ', Data: ' + message.payloadString)

    msgs_check(message.destinationName, message.payloadString);
};

var mqtt_publish = function(payload, topic, _qos) {
    if (typeof _qos == 'undefined') _qos = 2;
    var message = new Messaging.Message(payload);
    message.destinationName = topic;
    message.qos = _qos;
    client.send(message);
}

var mqtt_subscribe = function(topic, _qos) {
    if (typeof _qos == 'undefined') _qos = 2;
    client.subscribe(topic, {qos: _qos});
}

var mqtt_connect = function() {
    client.connect(options);
}

var mqtt_disconnect = function() {
    client.disconnect();
}

//
//  msgs  //
//

var parseJSON = function(str) {
    //  parse str  //
    var jsonedObj;
    try {
        jsonedObj = JSON.parse(str);
    } catch(e) {
        logs_log('Error: JSON ("' + str + '"): ' + e);
        return null;
    }
    return jsonedObj;
}

var msgs_check = function(topicStr, dataStr) {

    //  ping  //
    if(topicStr == "/debug/ping") {
        // logs_log('MQTT: PING (' + dataStr + ')');
        riddleName = dataStr;
        $("#riddlename").html("Riddle: <span style='color: green'>" + riddleName + "</span>");
        riddleTS = Date.now() / 1000;
    }
    
    // //  riddles info  //
    // else if(topicStr == "/er/riddles/info") {

    // }
}