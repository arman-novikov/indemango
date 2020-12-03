var logs_log = function(str) {

    //  get current time  //
    var currentdate = new Date(); 
    var datetime = ((currentdate.getHours() < 10) ? "0" : "") + currentdate.getHours() + ":"  
             + ((currentdate.getMinutes() < 10) ? "0" : "") + currentdate.getMinutes() + ":" 
             + ((currentdate.getSeconds() < 10) ? "0" : "") + currentdate.getSeconds() + "." 
             + ((currentdate.getMilliseconds() < 100) ? "0" : "") + ((currentdate.getMilliseconds() < 10) ? "0" : "") + currentdate.getMilliseconds(); 

    //  show log  //
    $('#div-logs').append('<li class="list-group-item">[' + datetime + '] ' + str + '</li>');
}

var time_unixToString = function (UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);

  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var monthNum = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();

  var datetime = ((date < 10) ? "0" : "") + date  
  	+ '.' + ((monthNum < 10) ? "0" : "") + monthNum 
  	+ '.' + year  
  	+ '   ' + ((hour < 10) ? "0" : "") + hour 
  	+ ':' + ((min < 10) ? "0" : "") + min 
  	+ ':' + ((sec < 10) ? "0" : "") + sec;

  return datetime;
}
