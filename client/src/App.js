import React from 'react';
import { ReactMic } from 'react-mic';
var toWav = require('audiobuffer-to-wav');
var xhr = require('xhr');
var context = new AudioContext();
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    };
  }

  startRecording = () => {
    this.setState({ record: true });
  };

  stopRecording = () => {
    this.setState({ record: false });
  };

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
  }

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          visualSetting='frequencyBars'
          className='sound-wave'
          onStop={this.onStop}
          onData={this.onData}
          noiseSuppression='true'
          strokeColor='#000000'
          backgroundColor='red'
          strokeColor='white'
          mimeType='audio/wav'
        />
        {this.state.record ? <p>Recording...</p> : ''}
        <button onClick={this.startRecording} type='button'>
          Start
        </button>
        <button onClick={this.stopRecording} type='button'>
          Stop
        </button>
      </div>
    );
  }
}
