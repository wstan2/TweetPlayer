const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const config = require("./config.js");

const port = process.env.PORT || 3001;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.json());

let Twit = require("twit");

let T = new Twit(config);

let twitterStream;

let word = "#NowPlaying spotify track";

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

const startTwitterStream = () => {
	if (twitterStream == null) {
		console.log("Creating Twitter Stream.");
		twitterStream = T.stream("statuses/filter", {
			track: word,
		});
		twitterStream.on("tweet", function(tweet) {
			io.emit("newTweet", tweet);
		});
	}
};

const stopTwitterStream = () => {
	console.log("Stopping Twitter stream.");
	twitterStream.stop();
	twitterStream = null;
};

io.on("connection", (socket) => {
	console.log("Client Connected.");
	startTwitterStream();
	socket.on("disconnect", () => {
		if (Object.keys(io.sockets.sockets).length === 0) {
			stopTwitterStream();
		}
		console.log("Client disconnected.");
	});
});

module.exports.server = server.listen(3001, () => {
	console.log("Server is up on port 3001");
});
module.exports.app = app;
