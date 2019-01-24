var router = require('express').Router();

var axios = require('axios');

const url = 'http://ics.mosbach.dhbw.de/ics/calendars.list';

// return a list of courses
router.get('/', function (req, res, next) {
  axios({
    method: 'get',
    url: url,
    responseType: 'text'
  })
    .then(d => {
      var courses = d.data.split('\n');
      var coursesJSON = [];

      courses.forEach(data => {
        var entry = data.split(';')
        if (entry[0] !== "")
          coursesJSON.push({
            title: entry[0],
            calendarUrl: entry[1]
          })
      });

      return res.json(coursesJSON)
    })
    .catch(next)
});

module.exports = router;
