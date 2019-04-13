import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let osc = audioCtx.createOscillator();
osc.type = "triangle";

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
		this.setState(state => ({
			ranges: [
				...state.ranges.slice(0, index),
				parseInt(event.target.value),
				...state.ranges.slice(index + 1)
			]
		}));
	};

	loop = () => {
		var intervalId = setInterval(this.cycleSound, 250);
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
							max="2000"
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
