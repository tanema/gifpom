class LengthSetting extends React.Component {
  render() {
    let {disabled, title, value, onChange} = this.props;
    
    return <div className="column">
      <header>{title}</header>
      <div className="field has-addons">
        <div className="control lengthSetting">
          <input className="input" type="text" value={value} is-static readonly/>
        </div>
        <p className="control">
          <button className="button" disabled={disabled} onClick={() => onChange(-1)}>
            <i className="fas fa-minus-circle"></i>
          </button>
        </p>
        <p className="control">
          <button className="button" disabled={disabled} onClick={() => onChange(1)}>
            <i className="fas fa-plus-circle"></i>
          </button>
        </p>
      </div>
    </div>
  }
}

window.LengthSetting = LengthSetting 