var MQTT_ADDR = "192.168.10.1";
var MQTT_PORT = 8080;

//  to access not in local network  //
MQTT_ADDR = window.location.host;
is_decrease_time = true;
lang_current_val = 1;

langset = function(lang) {
  if (lang == lang_current_val) return;
  lang_current_val = lang;

  var langStr = "English";
  if (lang == 2) {
    langStr = "Language 2";
  } else 
  if (lang == 3) {
    langStr = "Language 3";
  } else 
  if (lang == 4) {
    langStr = "Language 4";
  } else 
  if (lang == 5) {
    langStr = "Language 5";
  }
  $("#lang-current").html(langStr);
  mqtt_publish(lang.toString(), "/er/mc1/lang/set");
};

level_current_val = 1;
levelset = function(level) {
  console.log(level);
  if (level == level_current_val) return;
  level_current_val = level;
  var level_str = "basic";
  if (level == 2) {
    level_str = "advanced";
  }
  $("#level-current").html(level_str);
  mqtt_publish(level_str, "/er/gamelevel/cmd");
  logs_log("User: Level set to " + level_str);
};

time_current_val = 1;
timeset = function(time) {
  if (time == time_current_val) return;
  time_current_val = time;
  var game_period_min;
  if (time == 1) {
    game_period_min = 60;
  }
  if (time == 2) {
    game_period_min = 55;
  }
  if (time == 3) {
    game_period_min = 50;
  }
  if (time == 4) {
    game_period_min = 45;
  }
  if (time == 5) {
    game_period_min = 30;
  }
  if (time == 6) {
    game_period_min = 1;
  }
  if (time == 7) {
    game_period_min = 70;
  }
  if (time == 8) {
    game_period_min = 80;
  }
  localStorage.setItem("game_period", game_period_min);
  $("#time-current").val(game_period_min);
  $("#time-current").html(String(game_period_min) + ":00");
  $("#game_time").val(parseInt(game_period_min));
  $("#btnStart").val("rasp_timer_offline");
  format_time(game_period_min, 0);
  logs_log("User: Set game period: " + game_period_min + " min");
  mqtt_publish(game_period_min.toString(), "/er/timer/period");
};

function animateClick(element, animation) {
  $(element).addClass(animation);
  window.setTimeout(function() {
    $(element).removeClass(animation);
  }, 200);
}

function timer_decrement(game_period_min, sec_from_start) {
  setTimeout(function() {
    format_time(game_period_min, sec_from_start++);
    if (is_decrease_time) {
      if (sec_from_start <= game_period_min * 60) {
        timer_decrement(game_period_min, sec_from_start);
      }
    } else {
      $("#game_time").html("00:00");
    }
  }, 1000);
}

function format_time(period, duration) {
  if (period * 60 > duration) {
    sec_from_start = parseInt(duration);
    game_period_min = parseInt(period);
    var timer_sec = game_period_min * 60 - sec_from_start;
    var min = Math.floor(timer_sec / 60);
    var sec = timer_sec % 60;
    var strTime =
      (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
    $("#game_time").html(strTime);
    localStorage.setItem("min", game_period_min);
    localStorage.setItem("sec", sec_from_start);
  }
  if (period * 60 == duration) {
    $("#game_time").html("00:00");
    // $("#btnResetAll").click();
  }
}

//  on ready  //
$(document).ready(function() {
  //  show props  //
  ui_hideAllData();
  if (localStorage.getItem("game_period") == null) {
    $("#time-current").val(60);
  } else {
    $("#time-current").val(localStorage.getItem("game_period"));
    $("#time-current").html(
      String(localStorage.getItem("game_period")) + ":00"
    );
  }

  // var game_period_min = $('#gamePeriod_input')
  var sec_from_start = 0;
  is_decrease_time = true;
  is_timer_start = false;

  if (localStorage.getItem("timer_start") == "true") {
    var min_store = localStorage.getItem("min");
    var sec_store = localStorage.getItem("sec");
    timer_decrement(min_store, sec_store);

    $("#menu2").attr("disabled", true);
    $("#menu3").attr("disabled", true);
  }

  $("#btnStart").click(function() {
    animateClick(this, "ds-btn-click");
    is_decrease_time = true;
    is_timer_start = true;
    logs_log("User: Start game");
    mqtt_publish("start", "/er/cmd");


    if ($("#btnStart").val() == "rasp_timer_offline"){
      if (localStorage.getItem("timer_start") == "true") {
        var game_period_min = $("#game_time").html();
      } else {
        var game_period_min = $("#time-current").val();
        timer_decrement(game_period_min, 1);
        localStorage.setItem("timer_start", true);
      }   
    } else if ($("#btnStart").val() == "rasp_timer_online"){
        localStorage.setItem("min", 0);
        localStorage.setItem("sec", 0);
        localStorage.setItem("timer_start", false);
    }

    $("#menu2").attr("disabled", true);
    $("#menu3").attr("disabled", true);
    mqtt_publish(game_period_min.toString(), "/er/timer/period");
  });

  $("#btnResetAll").click(function() {
    animateClick(this, "ds-btn-click");
    logs_log("User: Reset All");
    is_decrease_time = false;
    is_timer_start = false;
    mqtt_publish("reset", "/er/cmd");
    localStorage.setItem("timer_start", false);
    localStorage.setItem("min", 0);
    localStorage.setItem("sec", 0);
    $("#menu2").attr("disabled", false);
    $("#menu3").attr("disabled", false);
    $("#game_time").html("00:00");
    $("#game_time").val($("#time-current").val());
  });

  $("#data-props").show();

  $("#nav-props").click(function() {
    ui_hideAllData();
    $("#data-props").show();
  });

  $("#nav-hints").click(function() {
    ui_hideAllData();
    $("#data-hints").show();
  });

  $("#nav-sound").click(function() {
    ui_hideAllData();
    $("#data-sound").show();
  });

  $("#nav-camera").click(function() {
    ui_hideAllData();
    $("#data-camera").show();
  });

  $("#nav-logs").click(function() {
    ui_hideAllData();
    $("#data-logs").show();
  });

  $("#nav-stat").click(function() {
    ui_hideAllData();
    $("#data-stat").show();
  });

  $("#nav-exit").click(function() {
    location.href = "/index.html";
  });

  $("#mc1-btn-pause").click(function() {
    animateClick(this, "ds-btn-click");
    mqtt_publish("1", "/er/mc1/pause");
  });

  $("#mc1-btn-resume").click(function() {
    animateClick(this, "ds-btn-click");
    mqtt_publish("1", "/er/mc1/resume");
  });

  $("#mc2-btn-pause").click(function() {
    animateClick(this, "ds-btn-click");
    mqtt_publish("1", "/er/mc2/pause");
  });

  $("#mc2-btn-resume").click(function() {
    animateClick(this, "ds-btn-click");
    mqtt_publish("1", "/er/mc2/resume");
  });

  $("#mc1_sliderVol").slider();
  // $("#mc1_sliderVol").on("slide", function(slideEvt) {
  //     // mc1_vol_new = $("#mc1_sliderVol").val();
  //     // mc1_vol_new_ts = Date.now();
  // });

  $("#mc2_sliderVol").slider();
  // $("#mc1_sliderVol").on("slide", function(slideEvt) {
  //     // mc1_vol_new = $("#mc1_sliderVol").val();
  //     // mc1_vol_new_ts = Date.now();
  // });

  $("#btnHat").click(function() {
    animateClick(this, "ds-btn-click");
    logs_log("User: Hat");
    mqtt_publish("on", "/er/distributivehat/cmd");
    //  10 sec  //
    setTimeout(function() {
      mqtt_publish("off", "/er/distributivehat/cmd");
    }, 10000);
  });

  $("#btnBegin").click(function() {
    animateClick(this, "ds-btn-click");
    logs_log("User: Begin sound");
    mqtt_publish("31", "/er/music/play");
  });

  $("#langSound").change(function() {
    // alert($(this).val());
    mqtt_publish($(this).val(), "/er/mc1/lang/set");
  });

  $("#gamePeriod_setBtn").click(function() {
    animateClick(this, "ds-btn-click");
    var game_period = parseInt($("#gamePeriod_input").val()); 
    if (game_period != "") {
      game_period_min = game_period;
      format_time(game_period_min, 0);
      logs_log("User: Set game period: " + game_period_min + " min");
      mqtt_publish(game_period_min.toString(), "/er/timer/period");
    }
  });

  //    $("#setLevelBtn").change(function() {
  //        //alert($(this).val());
  //        //mqtt_publish($(this).val(), '/er/level');
  //        mqtt_publish("/er/level|"+$(this).val(), '/er/set');
  //    });
  //
  //    $("#setLevelBtn").click(function() {
  //    animateClick(this, "ds-btn-click");
  //    var level = $("#level-current option:selected").text();
  //        mqtt_publish(level, '/er/gamelevel/cmd');
  //        if($(this).val() == 0){
  //            var button = document.getElementById("setLevelBtn");
  //            button.setAttribute("disabled", "disabled");
  //        } else {
  //            var button = document.getElementById("setLevelBtn");
  //            button.removeAttribute("disabled", "disabled");
  //        }
  //    });

  /*function retainLevel(value){
        alert(value);
    }*/

  /*$("#setLevelBtn_Easy").click(function() {
        // alert($(this).val());
        mqtt_publish("Level changed for Easy", '/er/???');*/

  // $("#btn-vol-up").click(function(){
  //     var newVol = mc1_vol_current + 10;
  //     mqtt_publish(newVol.toString(), '/er/music/vol/set');
  // });

  // $("#btn-vol-down").click(function(){
  //     var newVol = mc1_vol_current - 10;
  //     mqtt_publish(newVol.toString(), '/er/music/vol/set');
  // });

  //Init

  mqtt_connect();

  // //
  // //  Samp data  //
  // //

  // riddlesInfo_add({ "number":"10",  "strId":"r1",    "strName":"Bowman",         "strStatus":"Finished" }, function(obj) {
  //     ui_riddles_show();
  //     logs_log("Riddles: New riddle: " + obj.strName + " | " + obj.strId)
  // }, function(obj){
  //     ui_riddles_show();
  //     logs_log("Riddles: New status: " + obj.strName + ": " + obj.strStatus)
  // });
  // riddlesInfo_add({ "number":"10",  "strId":"r1",    "strName":"Bowman",         "strStatus":"Fucked" }, function(obj) {
  //     ui_riddles_show();
  //     logs_log("Riddles: New riddle: " + obj.strName + " | " + obj.strId)
  // }, function(obj){
  //     ui_riddles_show();
  //     logs_log("Riddles: New status: " + obj.strName + ": " + obj.strStatus)
  // });
  // msgs_check("/er/riddles/info", '{ "number":"10",  "strId":"r1",    "strName":"Bowman",         "strStatus":"Bitch" }');
  // riddlesInfo_add({ "number":2,  "strId":"r2",    "strName":"Candles box",    "strStatus":"Finished" });
  // riddlesInfo_add({ "number":3,  "strId":"r3",    "strName":"Castle",         "strStatus":"Activated" });
  // riddlesInfo_add({ "number":4,  "strId":"r4",    "strName":"Dragon box",     "strStatus":"Not activated" });
  // riddlesInfo_add({ "number":5,  "strId":"r5",    "strName":"Helmet",         "strStatus":"Not activated" });
  // riddlesInfo_add({ "number":9,  "strId":"r6",    "strName":"Map",            "strStatus":"Not activated" });
  // riddlesInfo_add({ "number":8,  "strId":"r7",    "strName":"Pentagram",      "strStatus":"Not activated" });
  // riddlesInfo_add({ "number":7,  "strId":"r8",    "strName":"Scabbard",       "strStatus":"Not activated" });
  // riddlesInfo_add({ "number":"6",  "strId":"r9",    "strName":"6 Spirit board",   "strStatus":"Not activated" });
  // riddlesInfo_add({ "number":"10", "strId":"r10",   "strName":"10 Tower",          "strStatus":"Not activated" });
  // riddlesInfo_add({ "number":11, "strId":"r11",   "strName":"Door to exit",   "strStatus":"Not activated" });
  // ui_riddles_show();

  // soundList.push({ "strId":"1", "strName":"1.  Dragon box finished" });
  // soundList.push({ "strId":"2", "strName":"2.  Candles box finished" });
  // soundList.push({ "strId":"3", "strName":"3.  Bowman finished" });
  // soundList.push({ "strId":"4", "strName":"4.  Castle finished" });
  // soundList.push({ "strId":"5", "strName":"5.  Scabbard finished" });
  // soundList.push({ "strId":"6", "strName":"6.  Helmet finished" });
  // soundList.push({ "strId":"7", "strName":"7.  Pentagram finished" });
  // soundList.push({ "strId":"8", "strName":"8.  Map: 1" });
  // soundList.push({ "strId":"9", "strName":"9.  Map: 2" });
  // soundList.push({ "strId":"10", "strName":"10. Map: 3" });
  // soundList.push({ "strId":"11", "strName":"11. Map: 4" });
  // soundList.push({ "strId":"12", "strName":"12. Map: 5" });
  // soundList.push({ "strId":"13", "strName":"13. Map finished" });
  // soundList.push({ "strId":"14", "strName":"14. Spirit board finished" });
  // soundList.push({ "strId":"15", "strName":"15. Tower finished" });
  // ui_soundlist_show();
  // soundList_add({ "strId":"5", "strName":"5.  Suka 1" }, function(obj) {
  //     ui_soundlist_show();
  //     logs_log("Sound list: New sound: " + obj.strName);
  // });
  // soundList_add({ "strId":"6", "strName":"5.  Suka 2" }, function(obj) {
  //     ui_soundlist_show();
  //     logs_log("Sound list: New sound: " + obj.strName);
  // });
});

var ui_hideAllData = function() {
  $("#data-props").hide();
  $("#data-hints").hide();
  $("#data-sound").hide();
  $("#data-camera").hide();
  $("#data-stat").hide();
  $("#data-logs").hide();
};

//  Timers  //

var timerCheckSlider = setInterval(function() {
  mc1_checkSlider($("#mc1_sliderVol").val(), function(val) {
    //  onNewVal  //
    mqtt_publish(val, "/er/mc1/vol/set");
  });

  mc2_checkSlider($("#mc2_sliderVol").val(), function(val) {
    //  onNewVal  //
    mqtt_publish(val, "/er/mc2/vol/set");
  });
}, 100);

var timerUI = setInterval(function() {
  ui_riddles_show();
  // logs_log('Update UI');
}, 1000);

//
//  mqtt  //
//

var clientId = "id_" + parseInt(Math.random() * 1000, 10);
var client = new Messaging.Client(MQTT_ADDR, MQTT_PORT, clientId);
var options = {
  timeout: 3,
  onSuccess: function() {
    logs_log(
      "MQTT: Connected: " + MQTT_ADDR + ":" + MQTT_PORT + ", id: " + clientId
    );

    //  ping  //
    mqtt_subscribe("/er/ping");

    mqtt_subscribe("/er/name");

    mqtt_subscribe("/er/cmd");
    mqtt_subscribe("/er/timer/sec");
    mqtt_subscribe("/er/timer/state");

    //  riddles  //
    mqtt_subscribe("/er/riddles/info");
    logs_log("MQTT: Subscribed: " + "/er/riddles/info");

    //  music  //
    mqtt_subscribe("/er/music/info");
    logs_log("MQTT: Subscribed: " + "/er/music/info");
    mqtt_subscribe("/er/music/soundlist");
    logs_log("MQTT: Subscribed: " + "/er/music/soundlist");

    //  game timer //
    mqtt_subscribe("/game/period");
    logs_log("MQTT: Subscribed: " + "/game/period");

    mqtt_subscribe("/game/duration");
    logs_log("MQTT: Subscribed: " + "/game/duration");

    //  unixts  //
    mqtt_subscribe("/unixts");
    logs_log("MQTT: Subscribed: " + "/unixts");

    //  stat  //
    mqtt_subscribe("/stat/games/count");
    logs_log("MQTT: Subscribed: " + "/stat/games/count");

    //  stat  //
    mqtt_subscribe("/er/mc1/lang/set");
  },
  onFailure: function(message) {
    logs_log(
      "Error: MQTT: Connection: " +
        MQTT_ADDR +
        ":" +
        MQTT_PORT +
        ": " +
        message.errorMessage
    );
  }
};

client.onConnectionLost = function(responseObject) {
  alert(
    "Connection lost: Please, press OK, and wait for reboot (" +
      responseObject.errorMessage +
      ")"
  );
  location.reload();
};

client.onMessageArrived = function(message) {
  logs_log(
    "MQTT: Topic: " +
      message.destinationName +
      ", Data: " +
      message.payloadString
  );

  msgs_check(message.destinationName, message.payloadString);
};

var mqtt_publish = function(payload, topic, _qos) {
  if (typeof _qos == "undefined") _qos = 2;
  var message = new Messaging.Message(payload);
  message.destinationName = topic;
  message.qos = _qos;
  // message.retain = true;
  client.send(message);
};

var mqtt_subscribe = function(topic, _qos) {
  if (typeof _qos == "undefined") _qos = 2;
  client.subscribe(topic, { qos: _qos });
};

var mqtt_connect = function() {
  client.connect(options);
};

var mqtt_disconnect = function() {
  client.disconnect();
};

//
//  msgs  //
//

var parseJSON = function(str) {
  //  parse str  //
  var jsonedObj;
  try {
    jsonedObj = JSON.parse(str);
  } catch (e) {
    logs_log('Error: JSON ("' + str + '"): ' + e);
    return null;
  }
  return jsonedObj;
};

var msgs_check = function(topicStr, dataStr) {
  if (topicStr == "/er/timer/state"){
      if (dataStr == "active") {
          $("#btnStart").val("rasp_timer_online");
      }
  }
    

  else if (topicStr == "/er/timer/sec") {
    if (localStorage.getItem("timer_start") == "false"){
        var minute = $("#time-current").val();
        var sec = minute * 60 - dataStr;
        format_time(minute, sec);
    }
  }
  //  ping  //
  else if (topicStr == "/er/ping") {
    logs_log("MQTT: PING (" + dataStr + ")");
  }
  //  er cmd  //
  else if (topicStr == "/er/cmd") {
    if (dataStr == "start") {
      timer_decrement();
    }
    //     logs_log('MQTT: Recieved: START');

    //     game = {};
    //     game.number = gamesList.length + 1;
    //     game.start_ts = Math.round(+new Date() / 1000);
    //     game.duration = 0;

    //     gamesList.push(game);

    //     ui_gameslist_show();
    // }
    // else if(dataStr == "finish") {
    //     logs_log('MQTT: Recieved: FINISH');

    //     if(gamesList[0].duration == 0) {
    //         gamesList[0].duration = Math.round(+new Date() / 1000) - gamesList[0].start_ts;
    //     }

    //     ui_gameslist_show();
    // }
  }

  //  riddles info  //
  else if (topicStr == "/er/riddles/info") {
    //  parse str  //
    var jsonedObj = parseJSON(dataStr);
    if (jsonedObj == null) {
      return;
    }
    //  add  //
    riddlesInfo_add(
      jsonedObj,
      function(obj) {
        //  onAdded  //
        ui_riddles_show();
        logs_log("Riddles: New riddle: " + obj.strName + " | " + obj.strId);
      },
      function(obj) {
        //  onUpdated  //
        ui_riddles_show();
        logs_log("Riddles: New status: " + obj.strName + ": " + obj.strStatus);
      }
    );
  }

  //  music info  //
  else if (topicStr == "/er/music/info") {
    // logs_log("SUKA ");
    //  parse str  //
    var jsonedObj = parseJSON(dataStr);
    if (jsonedObj == null) {
      return;
    }
    //  mc1  //
    if (jsonedObj.strId == "mc1") {
      //  get volume  //
      var recievedVol = parseInt(jsonedObj.vol);
      //  check msg  //
      mc1_checkMsg(
        recievedVol,
        function(val) {
          $("#mc1_sliderVol").slider("setValue", val);
        },
        function(val) {
          $("#mc1_vol_value").text("Volume: " + val);
        }
      );

      //  get volume  //
      // var recievedLang = jsonedObj.lang;
      // var recievedLangInfo = jsonedObj.langinfo;
      // logs_log("LAAANG: " + recievedLang + "  " + recievedLangInfo);
    }
    //  mc2  //
    else if (jsonedObj.strId == "mc2") {
      //  get vol  //
      var recievedVol = parseInt(jsonedObj.vol);
      //  check msg  //
      mc2_checkMsg(
        recievedVol,
        function(val) {
          $("#mc2_sliderVol").slider("setValue", val);
        },
        function(val) {
          $("#mc2_vol_value").text("Volume: " + val);
        }
      );
    }
  }

  //  soundlist  //
  else if (topicStr == "/er/music/soundlist") {
    //  parse str  //
    var jsonedObj = parseJSON(dataStr);
    if (jsonedObj == null) {
      return;
    }
    //  add  //
    soundList_add(jsonedObj, function(obj) {
      ui_soundlist_show();
      logs_log("Sound list: New sound: " + obj.strName);
    });
  }

  //
  //  Stat  //
  //

  //  unixts  //

  //  lang  //
  else if (topicStr == "/er/mc1/lang/set") {
    var lang = parseInt(dataStr);
    langset(lang);
    logs_log("Lang: " + lang);
  }
  //  game period  //
  else if (topicStr == "/game/period") {
    //  games count  //
    var game_period_min = parseInt(dataStr);
    format_time(game_period_min, 0);
    $("#gamePeriod_input").val(game_period_min);
    logs_log("STAT: Game period: " + game_period_min);
  }

  //  games count  //
  else if (topicStr == "/stat/games/count") {
    //  games count  //
    var gamesCount = parseInt(dataStr);
    logs_log("STAT: Games count: " + gamesCount);

    //  sub to all games  //
    for (var i = 0; i < gamesCount; ++i) {
      if (gamesList_getByNumber(i + 1) == null) {
        mqtt_subscribe("/stat/games/" + (i + 1));
        // logs_log('STAT: Game SUB: ' + '/stat/games/' + (i + 1));
      }
    }
  }

  //  game  //
  else if (topicStr.startsWith("/stat/games/")) {
    //  game number  //
    var gameNumber = topicStr.substring(12);
    // logs_log("STAT: Game " + gameNumber + ": " + dataStr);

    //  parse str  //
    var jsonedObj = parseJSON(dataStr);
    if (jsonedObj == null) {
      return;
    }

    game = gamesList_getByNumber(gameNumber);
    if (game == null) {
      game = {};
      game.number = parseInt(gameNumber);
      gamesList.push(game);
    }

    game.start_ts = parseInt(jsonedObj.start_ts);
    game.duration = parseInt(jsonedObj.duration);
    game.state = parseInt(jsonedObj.state);

    // console.log(gamesList);

    ui_gameslist_show();
  } else if (topicStr == "/er/name") {
    $("#inputERName").val(dataStr);
    logs_log("STAT: Game name change: " + gamePeriod_min);
  } else if (topicStr == "/er/set") {
    period = parseInt(dataStr);
    $(".time").text(50);
    $("#gamePeriod_input").val(period);
    $("#game_time").html(period);
  }
  //        else if(topicStr == "/er/level/en"){
  //        //alert(topicStr);
  //        var level = parseInt(dataStr);
  //        if (level == 0 ){
  //
  //            var button = document.getElementById("setLevelBtn");
  //            var optionEn = document.getElementById("optEn");
  //            var optionDis = document.getElementById("optDis");
  //
  //
  //            button.setAttribute("disabled", "disabled");
  //            optionEn.removeAttribute("selected", "selected");
  //            optionDis.setAttribute("selected", "selected");
  //
  //        } else if(level == 1){
  //            var button = document.getElementById("setLevelBtn");
  //            var optionEn = document.getElementById("optEn");
  //            var optionDis = document.getElementById("optDis");
  //
  //            button.removeAttribute("disabled", "disabled");
  //            optionDis.removeAttribute("selected", "selected");
  //            optionEn.setAttribute("selected", "selected");
  //
  //        } else alert(dataStr);
  //    }
  //    else if(topicStr == "/er/gamelevel/cmd"){
  //        //alert(topicStr);
  //        var nlevel = parseInt(dataStr);
  //        if (nlevel == 1 ){
  //
  //            var easyLevel = document.getElementById("basic");
  //            var hardLevel = document.getElementById("advanced");
  //
  //            hardLevel.removeAttribute("selected", "selected");
  //            easyLevel.setAttribute("selected", "selected");
  //
  //        } else if(nlevel == 2){
  //            var easyLevel = document.getElementById("basic");
  //            var hardLevel = document.getElementById("advanced");
  //
  //            easyLevel.removeAttribute("selected", "selected");
  //            hardLevel.setAttribute("selected", "selected");
  //
  //        } else alert(dataStr);
  //    }
};

//
//  ui  //
//

var ui_riddles_show = function() {
  var strResult = "";
  for (var i = 0; i < riddlesInfo.length; i++) {
    // var strItem = '<li class="ds-li">\
    //     <table><tr>\
    //     <td width="100%"><span class="ds-txt ds-txt-gray" style="margin-left: 0">' + riddlesInfo[i].strName + '</span></td>\
    //     <td><span class="ds-txt ds-txt-gray">' + riddlesInfo[i].strStatus + '</span></td>\
    //     <td><button type="button" class="ds-btn ds-btn-violet" onclick=\'ui_onBtnFinish("' + riddlesInfo[i].strId + '");\'>Finish</button></td>\
    //     <td><button type="button" class="ds-btn ds-btn-orange" onclick=\'ui_onBtnReset("' + riddlesInfo[i].strId + '");\' style="margin-right: 0">Reset</button></td>\
    //     </tr></table>\
    // </li>';

    //  add number  //
    var number = i + 1;
    var strNumber = "";
    strNumber += number.toString() + ". ";

    //  get status  //
    var strStatus = riddlesInfo[i].strStatus;
    var lastUpdate = Math.floor(
      (Date.now() - riddlesInfo[i].lastUdateTS) / 1000
    );
    if (lastUpdate > 3) {
      strStatus = "Offline (" + lastUpdate.toString() + " sec)";
      logs_log(
        "Offline: " +
          riddlesInfo[i].strName +
          ": " +
          lastUpdate.toString() +
          " sec"
      );
    }

    //  set status color  //
    var strStatusColor = "ds-txt-gray";
    if (strStatus == "Not activated") {
      strStatusColor = "ds-txt-notactivated";
    } else if (strStatus == "Activated") {
      strStatusColor = "ds-txt-activated";
    } else if (strStatus == "Finished") {
      strStatusColor = "ds-txt-finished";
    } else if (strStatus.startsWith("Offline")) {
      strStatusColor = "ds-txt-offline";
    }

    var strItem = '\
        <li class="ds-li">\
            <div class="row">';
    strItem +=
      '<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="padding-top: 7px;">\
                        <span class="ds-txt ds-txt-gray" style="font-weight: bold;">\
                            ' +
      strNumber +
      riddlesInfo[i].strName +
      "\
                        </span>\
                    </div>";
    strItem +=
      '<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="padding-top: 7px; margin-bottom: 10px;">\
                        <span class="ds-txt ' +
      strStatusColor +
      '">\
                            ' +
      strStatus +
      "\
                        </span>\
                    </div>";

    strItem +=
      '<div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">\
                        <button type="button" class="ds-btn ds-btn-red" onclick=\'animateClick(this, "ds-btn-click");ui_onBtnReset("' +
      riddlesInfo[i].strId +
      '");\' style="margin-bottom: 10px">\
                            RESET\
                        </button>\
                    </div>';
    strItem +=
      '<div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">\
                        <button type="button" class="ds-btn ds-btn-orange" onclick=\'animateClick(this, "ds-btn-click");ui_onBtnActivate("' +
      riddlesInfo[i].strId +
      '");\' style="margin-bottom: 10px">\
                            ACTIVATE\
                        </button>\
                    </div>';
    strItem +=
      '<div class="col-lg-2 col-md-2 col-sm-4 col-xs-12">\
                        <button type="button" class="ds-btn ds-btn-green" onclick=\'animateClick(this, "ds-btn-click");ui_onBtnFinish("' +
      riddlesInfo[i].strId +
      '");\' style="margin-bottom: 10px">\
                            FINISH\
                        </button>\
                    </div>';
    strItem +=
      '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">\
                        <button type="button" class="ds-btn ds-btn-violet" onclick=\'animateClick(this, "ds-btn-click");ui_onBtnHint1("' +
      riddlesInfo[i].number +
      '");\' style="margin-bottom: 10px">\
                            HINT 1\
                        </button>\
                    </div>';
    strItem +=
      '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">\
                        <button type="button" class="ds-btn ds-btn-violet" onclick=\'animateClick(this, "ds-btn-click");ui_onBtnHint2("' +
      riddlesInfo[i].number +
      '");\' style="margin-bottom: 10px">\
                            HINT 2\
                        </button>\
                    </div>';
    strItem += "</div>\
        </li>";

    strResult += strItem;
  }

  $("#ul-riddles").html(strResult);
};

var ui_soundlist_show = function() {
  var strResult = "";

  for (var i = 0; i < soundList.length; i++) {
    //  add number  //
    var number = i + 1;
    var strNumber = "";
    strNumber += number.toString() + ". ";

    var strItem =
      '<br><button class="btn-sound text-left" type="button" onclick=\'animateClick(this, "ds-btn-click");ui_onBtnSoundPlay("' +
      soundList[i].strId +
      "\");'>" +
      strNumber +
      soundList[i].strName +
      "</button>";

    strResult += strItem;
  }

  $("#sound-list").html(strResult);
};

var ui_gameslist_show = function() {
  gamesList_sort();

  var strResult = "";

  // if(gamesList.length == 0) {
  //     strResult = '<li class="ds-li">The statistics is only available with connected IndeSTAT device</li>';
  // } else {

  for (var i = 0; i < gamesList.length; i++) {
    var strItem = "";
    strItem += '<li class="ds-li">';
    strItem += '<div class="row">';

    //  Date time  //
    strItem +=
      '        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" style="padding-top: 7px;">';
    strItem +=
      '            <span class="ds-txt ds-txt-gray" style="font-weight: bold;">';
    strItem += "                " + time_unixToString(gamesList[i].start_ts);
    strItem += "            </span>";
    strItem += "        </div>";

    //  Duration  //
    if (gamesList[i].duration != 0) {
      strItem +=
        '        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6" style="padding-top: 7px;">';
      strItem +=
        '            <span class="ds-txt ds-txt-finished" style="font-weight: bold;">';
      strItem +=
        "                " +
        Math.floor(gamesList[i].duration / 60) +
        " min " +
        (gamesList[i].duration % 60) +
        " sec";
      strItem += "            </span>";
      strItem += "        </div>";
    }

    //  State  //
    if (gamesList[i].state != 0) {
      strItem +=
        '        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6" style="padding-top: 7px;">';

      if (gamesList[i].state == 1) {
        strItem +=
          '            <span class="ds-txt ds-txt-activated" style="font-weight: bold;">';
        strItem += "                " + "WIN";
        strItem += "            </span>";
      } else if (gamesList[i].state == 2) {
        strItem +=
          '            <span class="ds-txt ds-txt-finished" style="font-weight: bold;">';
        strItem += "                " + "TIME OUT";
        strItem += "            </span>";
      } else if (gamesList[i].state == 3) {
        strItem +=
          '            <span class="ds-txt ds-txt-notactivated" style="font-weight: bold;">';
        strItem += "                " + "CANCELED";
        strItem += "            </span>";
      }

      strItem += "        </div>";
    }

    strItem += "    </div>";
    strItem += "</li>";

    strResult += strItem;
  }

  // }

  $("#stat-list").html(strResult);
};

var ui_onBtnSoundPlay = function(strId) {
  var temp = parseInt(strId) + 200;
  logs_log(temp);
  logs_log("User: Sound play: " + String(temp));

  mqtt_publish(String(temp), "/er/music/play");
};

var ui_onBtnFinish = function(strRiddleId) {
  logs_log("User: Activate: " + strRiddleId);

  mqtt_publish("finish", "/er/" + strRiddleId + "/cmd");
};

var ui_onBtnReset = function(strRiddleId) {
  logs_log("User: Reset: " + strRiddleId);

  mqtt_publish("reset", "/er/" + strRiddleId + "/cmd");
};

var ui_onBtnActivate = function(strRiddleId) {
  logs_log("User: Activate: " + strRiddleId);

  mqtt_publish("activate", "/er/" + strRiddleId + "/cmd");
};

var ui_onBtnHint1 = function(strRiddleId) {
  logs_log("User: Hint 1: " + strRiddleId);

  mqtt_publish(strRiddleId, "/er/hint1");
};

var ui_onBtnHint2 = function(strRiddleId) {
  logs_log("User: Hint 2: " + strRiddleId);

  mqtt_publish(strRiddleId, "/er/hint2");
};

var ui_onBtnAutohint1 = function(strRiddleNumber) {
  logs_log("User: Hint 1: " + strRiddleNumber);
  mqtt_publish("" + strRiddleNumber, "/er/autohint1");
};

var ui_onBtnAutohint2 = function(strRiddleNumber) {
  logs_log("User: Hint 2: " + strRiddleNumber);
  mqtt_publish("" + strRiddleNumber, "/er/autohint2");
};
