//in the app.js file
//make sure to require mongoose
var mongoose = require('mongoose');

// add your routes files in the app.js file, eg
require('./routes/CreateBlog.js')(app);
require('./routes/BlogHome.js')(app);
require('./routes/delete.js')(app);
require('./routes/update.js')(app); //HYPERION note: For more information about this approach to separate routes, see here:https://stackoverflow.com/questions/6059246/how-to-include-route-handlers-in-multiple-files-in-express

//Add the connection to mongo
const uri = 'mongodb://yourDB:username:<pwd>'; // get this from the connection button on atlas gui
mongoose.Promise = global.Promise;

mongoose.connect(uri, {
    useMongoClient: true
});

mongoose.connection.on('error', function () {
    console.log('Connection to Mongo established.');
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
mongoose.connection.once('open', function () {
    console.log("Successfully connected to the database");
})

// End special additions to app.js. The rest in this file are pretty much boilerplate

// Add your routes files

// Add your controller file

// Add your model file(s), which includes the schema

// Add your views (jade/pug files)


/*
Notes app:
https://www.sitepoint.com/build-simple-beginner-app-node-bootstrap-mongodb/

Task mgmt:
https://steemit.com/utopian-io/@rhotimee/node-task-management-app

User authentication (backend only):
https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e
*/