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

      for (let i = 0; i < courses.length; i++) {
        var entry = courses[i].split(';')
        coursesJSON[i] = new Course()
        coursesJSON[i].title = entry[0]
        coursesJSON[i].calendarUrl = entry[1]
      }

      return res.json(coursesJSON)
    })
    .catch(next)
});

function Course() {
  this.title;
  this.calendarUrl;
}

module.exports = router;
