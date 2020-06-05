import React from "react";
import { ReactMic } from "react-mic";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import MicIcon from "@material-ui/icons/Mic";
import Typography from "@material-ui/core/Typography";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      blobObject: null,
      result: "",
      recording: false,
      blobURL: "",
    };
  }

  startRecording = () => {
    this.setState({ record: true });
  };

  stopRecording = () => {
    this.setState({ record: false });
  };

  onData(recordedBlob) {
    console.log("chunk of real-time data is: ", recordedBlob);
  }
  saveByteArray = (() => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (url, name) {
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    };
  })();
  onStop = (recordedBlob) => {
    console.log("recordedBlob is: ", recordedBlob);
    // const blobURL = URL.createObjectURL(recordedBlob);
    this.setState({ blobURL: recordedBlob.blobUrl, isRecording: false });
    this.saveByteArray([recordedBlob.blobUrl], "../src/test1.wav");
  };

  getResult = async () => {
    try {
      let result = await axios.get("http://localhost:8888/detect");
      this.setState({ result: result.data.message });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <Container maxWidth="sm">
        <Card style={{ marginTop: "100px" }}>
          <CardHeader title="Voice detector app" />
          <CardMedia style={{ margin: "auto" }}>
            <ReactMic
              record={this.state.record}
              visualSetting="frequencyBars"
              className="sound-wave"
              onStop={this.onStop}
              onData={this.onData}
              noiseSuppression="true"
              strokeColor="white"
              backgroundColor="green"
              mimeType="audio/wav"
            />
          </CardMedia>
          <CardContent>
            <div>{this.state.record ? <p>Recording...</p> : ""}</div>
            <div style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.startRecording}
                style={{ marginRight: "20px" }}
              >
                <MicIcon />
                Record
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.stopRecording}
              >
                Stop
              </Button>
            </div>
            <CardContent style={{ textAlign: "center" }}>
              <audio ref="audio_tag" src={this.state.blobURL} controls />
            </CardContent>

            <CardContent style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.getResult}
              >
                Predict
              </Button>
            </CardContent>
            <RecordVoiceOverIcon color="primary" />
            <Typography variant="h6">Result: {this.state.result}</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }
}
