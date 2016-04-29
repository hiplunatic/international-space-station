function gotRefreshedData(iss, weather){
  console.log('iss data', iss);
  console.log('weather', weather);
}

function refreshData() {
  var apiKey = "ef3d980bb7bf92cc26ddafb1e5e10b1c";
  jQuery.getJSON("http://api.open-notify.org/iss-pass.json?lat=50.8&lon=-0.3667&n=100&callback=?", function (iss) {
    jQuery.getJSON("http://api.openweathermap.org/data/2.5/forecast?lat=50.8&lon=-0.3667&APPID="+ apiKey +"&callback=?", function (weather) {
      gotRefreshedData(iss, weather);
    });
  });
}

refreshData();
$('#refresh').on('click', refreshData);
