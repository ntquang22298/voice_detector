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
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      blobObject: null,
      result: "",
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

  onStop(recordedBlob) {
    console.log("recordedBlob is: ", recordedBlob);
  }

  getResult = async () => {
    try {
      let result = await axios.get("http://localhost:8888/detect");
      console.log(result);
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
              strokeColor="#000000"
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
            <div>
              {/* <audio ref="audioSource" controls="controls" src=''/> */}
              <Button
                variant="contained"
                color="secondary"
                onClick={this.getResult}
              >
                Predict
              </Button>
              <p>Result: {this.state.result}</p>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }
}
