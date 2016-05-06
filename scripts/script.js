function gotRefreshedData(iss, weather){
  var flyovers = _.map(iss.response, processFlyoverData);
  var flyoversWithWeather = _.where(flyovers, {hasWeather: true});

  console.log('iss data', iss);
  console.log('weather', weather);

  function outputFlyover(flyover, i){
    $('.flyovers').append('<div>Flyover at ' + flyover.risetime + ':' + flyover.weatherDescription +'</div');
  }

  function processFlyoverData(flyover){
    var weatherAtFlyover = _.find(weather.list, function(w){
      return w.dt <= flyover.risetime && w.dt + 60*60*3 > flyover.risetime;
    });

    return{
      hasWeather: !_.isUndefined(weatherAtFlyover),
      weatherDescription: weatherAtFlyover && weatherAtFlyover.weather[0].description,
      risetime: new Date(flyover.risetime * 1000),
      duration: flyover.duration
    };
  }

  _.each(flyoversWithWeather, outputFlyover);
}

function refreshData() {
  var apiKey = "ef3d980bb7bf92cc26ddafb1e5e10b1c";
  jQuery.getJSON("http://api.open-notify.org/iss-pass.json?lat=50.8&lon=-0.3667&n=5&callback=?", function (iss) {
    jQuery.getJSON("http://api.openweathermap.org/data/2.5/forecast?lat=50.8&lon=-0.3667&APPID="+ apiKey +"&callback=?", function (weather) {
      gotRefreshedData(iss, weather);
    });
  });
}

refreshData();
$('#refresh').on('click', refreshData);
