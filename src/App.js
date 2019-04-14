import React, { Component } from "react";
import "./App.css";

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let osc = audioCtx.createOscillator();
osc.type = "sawtooth";

var osc_volume = audioCtx.createGain();
osc_volume.gain.linearRampToValueAtTime(0, 0);
osc.connect(osc_volume);
osc_volume.connect(audioCtx.destination);

osc.start();

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ranges: [440, 440, 440, 440, 440, 440, 440, 440],
			currentRange: 0,
			firstTime: true,
			volume: 0.1,
			playing: false
		};
	}
	changeSlider = (event, index) => {
		this.setState(state => ({
			ranges: [
				...state.ranges.slice(0, index),
				parseInt(event.target.value),
				...state.ranges.slice(index + 1)
			]
		}));
	};

	loop = () => {
		if (!this.state.playing) {
			var intervalId = setInterval(this.cycleSound, 250);
			this.setState(() => ({
				intervalId
			}));
		}
	};
	stopLoop = () => {
		clearInterval(this.state.intervalId);
		if (this.state.playing) {
			osc.disconnect(audioCtx.destination);
			this.setState(() => ({ playing: false }));
		}
	};
	cycleSound = () => {
		const { ranges, currentRange } = this.state;
		this.playSound(ranges[currentRange]);
		this.setState(state => ({
			currentRange:
				state.currentRange < state.ranges.length - 1
					? state.currentRange + 1
					: 0
		}));
	};
	playSound = freq => {
		if (!this.state.playing) {
			this.setState(state => ({ playing: true }));
		}

		osc.frequency.value = freq; // value in hertz

		osc_volume.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
		osc.connect(audioCtx.destination);
		setTimeout(() =>
			osc_volume.gain.linearRampToValueAtTime(
				0,
				audioCtx.currentTime + 0.01,
				100
			)
		);
	};

	render() {
		const { ranges } = this.state;
		return (
			<div className="App">
				<div>
					<p>{ranges.map(item => item)}</p>
				</div>
				<div>
					{ranges.map((item, i) => (
						<input
							key={i}
							value={ranges[i]}
							onChange={() => this.changeSlider(window.event, i)}
							type="range"
							min="40"
							max="1500"
						/>
					))}
				</div>
				<button onClick={this.loop}>play</button>
				<button onClick={this.stopLoop}>stop</button>
			</div>
		);
	}
}

export default App;
