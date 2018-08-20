class Pomodoro extends React.Component {
  constructor() {
    super()

    let sessionLength = 20;
    let breakLength = 5;
    if (localStorage.getItem("sessionLength")) {
      sessionLength = parseInt(localStorage.getItem("sessionLength"));
    }
    if (localStorage.getItem("breakLength")) {
      breakLength = parseInt(localStorage.getItem("breakLength"));
    }

    this.state = {
      working: true,
      playing: false,
      paused: false,
      sessionLength: sessionLength,
      breakLength: breakLength,
      startTime: null,
      endTime: null,
    };
  }

  get length() {
    let {working, sessionLength, breakLength} = this.state;
    return (working === true ? sessionLength : breakLength);
  }

  get title() {
    return (this.state.working === true ? "Work" : "Break");
  }

  get time() {
    let {playing, paused, endTime, difference} = this.state;
    if (!playing && !paused) {
      return {minutes: this.length, seconds: "00"}
    }
    let seconds = Math.floor((difference/1000) % 60);
    let minutes = Math.floor((difference/1000) / 60 % 60);
    return {minutes: minutes, seconds: (seconds < 10 ? "0":"")+seconds}
  }

  play() {
    let {playing, paused, endTime} = this.state;

    if (playing) {
      this.setState({
        paused: true,
        playing: false,
      })
      clearInterval( this.timeinterval );
    } else {
      let startTime = new Date().getTime()
      let difference = paused ? this.state.difference : this.length * 60000
      this.setState({
        startTime: startTime,
        endTime: startTime + difference,
        difference: difference,
        paused: false,
        playing: true,
      })
      this.timeinterval = setInterval(this.updateCountdown.bind(this), 990);
    }
  }

  reset(){
    clearInterval( this.timeinterval );
    this.setState({
      startTime: null,
      endTime: null,
      paused: false,
      playing: false,
    })
  }

  change() {
    let {playing, working} = this.state;
    clearInterval(this.timeinterval);
    this.setState({
      working: !working,
      startTime: null,
      endTime: null,
      paused: false,
      playing: false,
    })
    if (playing) { setTimeout(this.play.bind(this), 100) }
  }

  updateCountdown() {
    let currTime = new Date().getTime();
    let difference = this.state.endTime - currTime;
    this.setState({difference: difference})
    if ( difference <= 1000 ) {
      this.playSound();
      this.change();
    }
  }

  playSound() {
    new Audio("http://soundbible.com/grab.php?id=2156&type=mp3").play();
  }

  onChangeSessionLength(val) {
    let {sessionLength} = this.state;
    if (sessionLength+val < 1) { return }
    this.setState({sessionLength: sessionLength+val})
    localStorage.setItem("sessionLength", sessionLength+val)
    this.reset();
  }

  onChangeBreakLength(val) {
    let {breakLength} = this.state;
    if (breakLength+val < 1) { return }
    this.setState({breakLength: breakLength+val})
    localStorage.setItem("breakLength", breakLength+val)
    this.reset();
  }

  render() {
    let {playing, working, sessionLength, breakLength} = this.state;
    let {minutes, seconds} = this.time;

    return <div className="box has-text-centered">
      <div className={"countdown-container " + (!working ? 'break' : 'working')}>
        <header>{this.title}</header>
        <time className="countdown">
          {minutes}:{seconds}
        </time>
      </div>

      <div className="field is-grouped is-grouped-centered">
        <p className="control">
          <button className="button is-primary" onClick={this.play.bind(this)}>
            <i className={"fas " + (playing ? "fa-pause" : "fa-play")}></i>
          </button>
        </p>
        <p className="control">
          <button className="button is-primary" onClick={this.reset.bind(this)}>
            <i className="fas fa-sync"></i>
          </button>
        </p>
        <p className="control">
          <button className="button is-primary" onClick={this.change.bind(this)}>
            <i className="fas fa-exchange-alt"></i>
          </button>
        </p>
      </div>

      <div className="columns settings">
        <LengthSetting
          disabled={playing}
          title="Session Length"
          value={sessionLength}
          onChange={this.onChangeSessionLength.bind(this)}
          />
        <LengthSetting
          disabled={playing}
          title="Break Length"
          value={breakLength}
          onChange={this.onChangeBreakLength.bind(this)}
          />
      </div>

      {working ? "" : <Giphy />}
    </div>
  }
}

window.Pomodoro = Pomodoro;