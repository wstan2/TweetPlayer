import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import Tweet from "./Tweet";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [],
    };
  }

  componentDidMount() {
    const socket = socketIOClient("http://localhost:3000/");

    socket.on("connect", () => {
      socket.on("newTweet", (tweet) => {
        this.setState((prevState) => ({
          tweets: [...prevState.tweets, tweet],
        }));
        console.log(this.state.tweets);
      });
      socket.on("disconnect", () => {
        socket.removeAllListeners("tweets");
        console.log("Socket Disconnected");
      });
    });
  }

  render() {
    let tweets = this.state.tweets.reverse();
    let tweetCards = tweets.map((tweet) => {
      return <Tweet key={tweet.id} tweet={tweet} />;
    });
    return (
      <div>
        <h1 class="ui center aligned header">
          <p></p>
          <div class="content">
            <i class="play circle icon"></i>
            TweetPlayer
            <div class="sub header">#NowPlaying in Realtime</div>
          </div>
        </h1>
        <div className="app-container">
          <div className="tweets-container">{tweetCards}</div>
        </div>
      </div>
    );
  }
}

export default App;
