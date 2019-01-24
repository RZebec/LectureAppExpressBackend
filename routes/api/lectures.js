var router = require('express').Router();
var ical2json = require('ical2json');
var moment = require('moment-timezone');

var axios = require('axios');

const urlStart = 'http://ics.mosbach.dhbw.de/ics/'
const fileEnding = '.ics'

router.param('course', function(req, res, next, course){
    const url = urlStart + course + fileEnding;
        axios({
            method: 'get',
            url: url,
            responseType: 'document'
          })
            .then(d => {
                var courseCalendar = ical2json.convert(d.data).VCALENDAR[0].VEVENT

                var lecturesJSON = [];

                courseCalendar.forEach(lecture => {
                    lecturesJSON.push({
                        UID: lecture.UID,
                        Course: course,
                        Location: lecture.LOCATION,
                        Description: lecture.DESCRIPTION,
                        Summary: lecture.SUMMARY,
                        OrganisationDay: moment(lecture["DTSTART;TZID=Europe/Berlin"]).startOf('day').unix(),
                        Start: moment(lecture["DTSTART;TZID=Europe/Berlin"]).tz("Europe/Berlin").unix(),
                        End: moment(lecture["DTEND;TZID=Europe/Berlin"]).tz("Europe/Berlin").unix(),
                        Creation: moment(lecture["CREATED"]).tz("Europe/Berlin").unix(),
                        LastModified: moment(lecture["LAST-MODIFIED"]).tz("Europe/Berlin").unix()
                    })
                });              

                req.lectures = lecturesJSON
                return next();
            })
            .catch(next);
  });

// return a list of lectures for a course
router.get('/:course', function(req, res, next) {
    if(req.lectures){
        return res.json(JSON.stringify(req.lectures))
    } else {
        return res.json({'Error': 'No Course selected.'})
    }  
});

module.exports = router;
