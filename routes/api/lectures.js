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

                for(let i = 0; i < courseCalendar.length; i++) {
                    const lecture = courseCalendar[i];
                    lecturesJSON[i] = new Lecture();
                    lecturesJSON[i].UID = lecture.UID;
                    lecturesJSON[i].Course = course;
                    lecturesJSON[i].Location = lecture.LOCATION;
                    lecturesJSON[i].Description = lecture.DESCRIPTION;
                    lecturesJSON[i].Summary = lecture.SUMMARY;
                    lecturesJSON[i].OrganisationDay = moment(lecture["DTSTART;TZID=Europe/Berlin"]).startOf('day').unix();
                    lecturesJSON[i].Start = moment(lecture["DTSTART;TZID=Europe/Berlin"]).tz("Europe/Berlin").unix();
                    lecturesJSON[i].End = moment(lecture["DTEND;TZID=Europe/Berlin"]).tz("Europe/Berlin").unix();
                    lecturesJSON[i].Creation = moment(lecture["CREATED"]).tz("Europe/Berlin").unix();
                    lecturesJSON[i].LastModified = moment(lecture["LAST-MODIFIED"]).tz("Europe/Berlin").unix();
                }                

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

function Lecture() {
    this.UID;
    this.Course;
    this.Location;
    this.OrganisationDay;
    this.Start;
    this.End;
    this.Summary;
    this.Creation;
    this.LastModified;
    this.Description;
  }

module.exports = router;
