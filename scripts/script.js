function ISSFlyover(){
  this.refreshData();
  _.bindAll(this, 'refreshData', 'gotRefreshedData');
  $('#refresh').on('click', this.refreshData);
}
_.extend(ISSFlyover.prototype, {
  gotRefreshedData: function(iss, weather, astros){
    var flyovers = _.map(iss.response, processFlyoverData);
    var flyoversWithWeather = _.where(flyovers, {hasWeather: true});
    var flyoversGrouped = _.groupBy(flyoversWithWeather, getDay);
    var days = _.keys(flyoversGrouped);
    var summary = _.countBy(flyoversWithWeather, 'weatherDescription');
    var atTheISS = _.pluck(_.where(astros.people, {craft: "ISS"}), "name");

    $('.astronauts').text(atTheISS.join(', '));

    $('.summary').html('');
    _.each(summary, function(count, condition){
      $('.summary').append('<div><b>' + condition + '</b>:' + count + '</div>');
    });

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

    _.each(days, function(day){
      $('.flyovers').append('<h2>'+ day +'</h2>');
      var flyoversForDay = flyoversGrouped[day];
      flyoversForDay = _.sortBy(flyoversForDay, 'clouds');
      _.each(flyoversForDay, outputFlyover);
    })
  },

  refreshData: function() {
    var location = {lat: 50.8, lon: -0.3667};
    var me = this;
    var apiKey = "ef3d980bb7bf92cc26ddafb1e5e10b1c";
    jQuery.getJSON("http://api.open-notify.org/iss-pass.json?lat=50.8&lon=-0.3667&n=20&callback=?", _.extend({n: 100}, location), function (iss) {
      jQuery.getJSON("http://api.openweathermap.org/data/2.5/forecast?&APPID="+ apiKey +"&callback=?", location, function (weather) {
        jQuery.getJSON("http://api.open-notify.org/astros.json?callback=?", function (astros) {
          me.gotRefreshedData(iss, weather, astros);
        });
      });
    });
  }
});

var issFlyover = new ISSFlyover();

