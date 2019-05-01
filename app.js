const express = require('express');
const app = express();
const config = require('./config/config');
const validator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');

const index = require('./index/index');
const register = require('./register/registerController');
const deregister = require('./deregister/deregister');
const match = require('./match/match');
const participants = require('./participants/participantsController');
const matched = require('./matched/matched');
const emailMatched = require('./emailMatched/emailMatched');
const participantsByDepartment = require('./participants-by-department/participants-by-department');
const dateParticipantsRegistered = require('./date-participants-registered/dateParticipantsRegistered');
const feedback = require('./feedback/feedback');
const admin = require('./admin/admin');
const error = require('./error/error');
const faq = require('./faq/faq');
const verify = require('./verify/verify');
const verifyAll = require('./verifyAll/verifyAll');
const matchEdit = require('./match-edit/matchEdit');

const port = config.app.port;

app.set('view engine', 'pug');

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(validator({
    customValidators: {
        departmentError: function(value) {
            if (value == "choose the department you belong to") {
                return false;
            } else {
                return true;
            }
        },
        consentChecked: function(value) {
            if (value == "on") {
                return true;
            } else {
                return false;
            }
        }
    }
}));

app.use(express.static('public'));
app.use(session({secret: 'curious', resave: false, saveUninitialized: true}));

app.use(function(req, res, next) {

    res.locals.session = req.session;
    next();
});

app.use(flash());

//MongoDB setup
const mongoose = require('mongoose');
mongoose.connect(config.db.url.server + config.db.url.port + "/" + config.db.name, {useNewUrlParser: true, useFindAndModify: false});
global.db = mongoose.connection;

global.db.on('error', console.error.bind(console, 'connection error: '));

global.db.on('open', function() {
    console.log('Mongoose connection opened');
});

app.use('/', index);
app.use('/register', register);
app.use('/deregister', deregister);
app.use('/feedback', feedback);

app.use('/admin', admin);
app.use('/match', match);
app.use('/participants', participants);
app.use('/matched', matched);
app.use('/emailMatched', emailMatched);
app.use('/participants-by-department', participantsByDepartment);
app.use('/date-participants-registered', dateParticipantsRegistered);
app.use('/oops', error);
app.use('/faq', faq);
app.use('/verify', verify);
app.use('/verifyAll', verifyAll);
app.use('/match-edit', matchEdit);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
