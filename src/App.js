import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let osc = audioCtx.createOscillator();
osc.type = "triangle";
// var analyser = audioCtx.createAnalyser();
// analyser.minDecibels = -90;
// analyser.maxDecibels = -10;
// analyser.smoothingTimeConstant = 0.85;
// var gainNode = audioCtx.createGain();
// osc.connect(gainNode);
// gainNode.connect(audioCtx.destination);

// gainNode.gain.value = 0;
// osc.frequency.value = 200;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ranges: [440, 440, 440, 440],
			currentRange: 0,
			firstTime: true
		};
	}
	changeSlider = (event, index) => {
		console.log("event ", event);
		// return;
		// event.persist();
		console.log(parseInt(event.target.value));
		this.setState(state => ({
			ranges: [
				...state.ranges.slice(0, index),
				parseInt(event.target.value),
				...state.ranges.slice(index + 1)
			]
		}));
	};

	looper = () => {
		var intervalId = setInterval(this.cycleSound, 500);
		this.setState(() => ({
			intervalId
		}));
	};
	stopLoop = () => {
		clearInterval(this.state.intervalId);
	};
	cycleSound = () => {
		const { ranges, currentRange } = this.state;
		this.playSound(ranges[currentRange]);
		this.setState(state => ({
			currentRange: state.currentRange < 3 ? state.currentRange + 1 : 0
		}));
	};
	playSound = freq => {
		if (this.state.firstTime) {
			osc.start();
			this.setState(state => ({ firstTime: false }));
		}
		osc.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
		osc.connect(audioCtx.destination);
		setTimeout(() => osc.disconnect(), 100);
	};
	// playSound = freq => {
	// 	if (this.state.firstTime) {
	// 		osc.start(0);
	// 		this.setState(state => ({ firstTime: false }));
	// 	}
	// 	var now = audioCtx.currentTime;

	// 	osc.connect(audioCtx.destination);
	// 	// Cancel any existing automation (to prevent overlaps).
	// 	osc.frequency.cancelScheduledValues(now);
	// 	gainNode.gain.cancelScheduledValues(now);

	// 	osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
	// 	// Gate-on.
	// 	gainNode.gain.setValueAtTime(gainNode.gain.value, now);
	// 	gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);

	// 	// Gate-off after 250ms.
	// 	gainNode.gain.setValueAtTime(0.1, now + 0.245);
	// 	gainNode.gain.linearRampToValueAtTime(0, now + 0.25);

	// 	// You might be able to move the frequency-increase here -
	// 	// so that it is already at the correct level for the next
	// 	// boop().
	// 	// value in hertz

	// 	setTimeout(() => osc.disconnect(), 100);
	// };

	render() {
		return (
			<div className="App">
				<div>
					<p>
						{this.state.ranges[0]}
						{this.state.ranges[1]}
						{this.state.ranges[2]}
						{this.state.ranges[3]}
					</p>
				</div>
				<div>
					<input
						value={this.state.ranges[0]}
						onChange={() => this.changeSlider(window.event, 0)}
						type="range"
						min="40"
						max="2000"
					/>
					<input
						value={this.state.ranges[1]}
						onChange={() => this.changeSlider(window.event, 1)}
						type="range"
						min="40"
						max="2000"
					/>
					<input
						value={this.state.ranges[2]}
						onChange={() => this.changeSlider(window.event, 2)}
						type="range"
						min="40"
						max="2000"
					/>
					<input
						value={this.state.ranges[3]}
						onChange={() => this.changeSlider(window.event, 3)}
						type="range"
						min="40"
						max="2000"
					/>
				</div>
				<button onClick={this.looper}>play</button>
				<button onClick={this.stopLoop}>stop</button>
			</div>
		);
	}
}

export default App;
