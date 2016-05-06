function gotRefreshedData(iss, weather){
  var flyovers = _.map(iss.response, processFlyoverData);
  var flyoversWithWeather = _.where(flyovers, {hasWeather: true});
  var flyoversGrouped = _.groupBy(flyoversWithWeather, getDay);

  var days = _.keys(flyoversGrouped);

  console.log('iss data', iss);
  console.log('weather', weather);
  console.log('days', flyoversGrouped);

  function getDay(flyover){
    return flyover.risetime.toDateString();
  }

  function outputFlyover(flyover, i){
    $('.flyovers').append('<div>Flyover at ' + flyover.risetime + ':' + flyover.weatherDescription +'</div');
  }

  function processFlyoverData(flyover){
    var weatherAtFlyover = _.find(weather.list, function(w){
      return w.dt <= flyover.risetime && w.dt + 60*60*3 > flyover.risetime;
    });

    return{
      clouds: weatherAtFlyover && weatherAtFlyover.clouds.all,
      hasWeather: !_.isUndefined(weatherAtFlyover),
      weatherDescription: weatherAtFlyover && weatherAtFlyover.weather[0].description,
      risetime: new Date(flyover.risetime * 1000),
      duration: flyover.duration
    };
  }

  //_.each(flyoversWithWeather, outputFlyover);
  _.each(days, function(day){
    $('.flyovers').append('<h2>'+ day +'</h2>');
    var flyoversForDay = flyoversGrouped[day];
    flyoversForDay = _.sortBy(flyoversForDay, 'clouds');
    _.each(flyoversForDay, outputFlyover);
  })
}

function refreshData() {
  var apiKey = "ef3d980bb7bf92cc26ddafb1e5e10b1c";
  jQuery.getJSON("http://api.open-notify.org/iss-pass.json?lat=50.8&lon=-0.3667&n=20&callback=?", function (iss) {
    jQuery.getJSON("http://api.openweathermap.org/data/2.5/forecast?lat=50.8&lon=-0.3667&APPID="+ apiKey +"&callback=?", function (weather) {
      gotRefreshedData(iss, weather);
    });
  });
}

refreshData();
$('#refresh').on('click', refreshData);
