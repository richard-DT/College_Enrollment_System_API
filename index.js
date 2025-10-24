const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollment");
const app = express();
require('dotenv').config();

//Google Login
const passport = require("passport");
const session = require('express-session');
require('./passport');


mongoose.connect(process.env.MONGODB_STRING);
let db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => console.log("We're connected to the cloud database"))


app.use(express.json());
app.use(express.urlencoded({extended:true}));


//CORS (Cross-Origin Resource Sharing)
// it allows our backend application to be available to our frontend application

//app.use(cors())

const corsOptions = {
	origin: ['http://localhost:8000'],
	//methods: ['GET', 'POST'],
	//allowedHeaders: ['Content-Type', 'Authorization']
	credentials: true, //cookies, headers
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

//Google Login
//Creates a session with given data
// resave prevents the session from overwriting while session is active
// saveUninitialized prevents the data from storing data in the session while data has not yet been initialized
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));
// initializes the passport when app runs
app.use(passport.initialize());
// creates a session using the passport package
app.use(passport.session())




app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);



if(require.main === module){
    app.listen(process.env.PORT || 3000, () => 
    	console.log(`API is now online on port ${process.env.PORT || 3000}`));
}

//Export both app and mongoose for only for checking
module.exports = {app,mongoose};