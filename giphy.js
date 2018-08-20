class Giphy extends React.Component {
  constructor(){
    super()
    this.state = {
      loading: true,
    }
    this.fetchGif();
  }
  
  fetchGif() {
    this.setState({loading: true})
    fetch(`https://api.giphy.com/v1/gifs/random?api_key=9uk7ak7JAYTFj0RYFnkoRL295XxtVy6n&tag=animals&rating=g`).then((resp)=> {
      return resp.json()
    }).then((data) => {
      this.setState({gif: data["data"]["image_original_url"]})
    }.bind(this))
  }
  
  render() {
    let {gif, loading} = this.state;
    return <div>
      <img width="250" onLoad={() => this.setState({loading: false})} src={gif}/>
      <button className={"button is-primary "+(loading ? "is-loading":"")} onClick={this.fetchGif.bind(this)}>
        <span className="icon">
          <i className="fas fa-sync"></i>
        </span>
        <span>I don't like this one.</span>
      </button>
      <img 
        width="100"
        src="https://cdn.glitch.com/4b8ed21e-014f-4ef7-96bc-b750152d7b22%2FPoweredby_640px-White_HorizText.png?1534550312605"/>
    </div>
  }
}

window.Giphy = Giphy