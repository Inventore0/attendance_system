const Course = require('../model/course');
const Student = require('../../login/model/student/student_model');
var moment = require('moment');
const Teacher = require('../../login/model/teacher/teacher_model');
// @route GET api/teacher/course/{id}
// @desc Returns a specific course
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const course = await Course.findById(id);

        if (!course) return res.status(401).json({
            message: 'Course does not exist.'
        });

        res.status(200).json({
            course
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


// @route POST api/teacher/course/addcourse
// @desc Add a new course
// @access Public
exports.addCourse = async (req, res) => {
    try {
        const id = req.body.teacherId;
        const teacher = await Teacher.findById(id);
        const newCourse = new Course({
            ...req.body,
        });

        await newCourse.generateRandomCourseCode();
        const course_ = await newCourse.save();
        course_.teacher = teacher;
        await course_.save();

        res.status(200).json({
            message: 'Course successfully created'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route DELETE api/teacher/course/deletecourse/{id}
// @desc Delete course
// @access Public
exports.deleteCourse = async function (req, res) {
    try {
        const id = req.params.id;

        await Course.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Course has been deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @route POST api/teacher/course/{id}/editschedule
// @desc Delete course
// @access Public
exports.editCourseSchedule = async (req, res) => {
    try {
        // require
        moment().format();
        let id = req.params.id;
        let courseStartDate = req.body.courseStartDate; //20.03.2014
        let courseEndDate = req.body.courseEndDate; //20.03.2015
        let courseTimes = req.body.courseTimes; //09:00-12:00
        let currentCourse = await Course.findById(id);

        if (!currentCourse) res.status(401).json({
            message: 'Course not found'
        });

        let courseScheduleArray = [];
        let timeArray = [];
        let dateArray = [];
        let startDate = moment(courseStartDate, 'DD-MM-YYYY');
        let endDate = moment(courseEndDate, 'DD-MM-YYYY');
        while (startDate <= endDate) {
            dateArray.push(moment(startDate).format('DD-MM-YYYY'));
            timeArray.push(courseTimes);
            startDate = moment(startDate).add(7, 'days');
        }

        for (let i = 0; i < dateArray.length; i++) {
            courseScheduleArray[i] = {};
            courseScheduleArray[i].date = dateArray[i];
            courseScheduleArray[i].time = timeArray[i];
        }
       
        currentCourse.attendance = courseScheduleArray;
        await currentCourse.save();

        res.status(200).json({
            message: 'Course schedule successfully added'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};