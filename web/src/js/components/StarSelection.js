import React, {Component} from 'react';

export default class StarSelection extends Component {

    constructor() {
        super();

        this.state = {
            numberOfStars: 0,
            savedValue: 0
        };

        this.setNumberOfStars = this.setNumberOfStars.bind(this);
        this.setClickedNumberOfStars = this.setClickedNumberOfStars.bind(this);
    }

    setNumberOfStars(value) {
        this.setState({numberOfStars: value});
    }

    setClickedNumberOfStars(value) {
        this.setState({savedValue: value});
        this.props.onClick(value);
    }

    render() {

        return (
            <div className="grades" onMouseLeave={() => this.setState({numberOfStars: 0})}>
                <span className={"oi" + (this.state.numberOfStars > 0 || this.state.savedValue > 0 ? ' active' : '')}
                      onClick={() => this.setClickedNumberOfStars(1)}
                      onMouseEnter={() => this.setNumberOfStars(1)} data-glyph="star"/>
                <span className={"oi" + (this.state.numberOfStars > 1 || (this.state.numberOfStars === 0 && this.state.savedValue > 1) ? ' active' : '')}
                      onClick={() => this.setClickedNumberOfStars(2)}
                      onMouseEnter={() => this.setNumberOfStars(2)} data-glyph="star"/>
                <span className={"oi" + (this.state.numberOfStars > 2 || (this.state.numberOfStars === 0 && this.state.savedValue > 2) ? ' active' : '')}
                      onClick={() => this.setClickedNumberOfStars(3)}
                      onMouseEnter={() => this.setNumberOfStars(3)} data-glyph="star"/>
                <span className={"oi" + (this.state.numberOfStars > 3 || (this.state.numberOfStars === 0 && this.state.savedValue > 3) ? ' active' : '')}
                      onClick={() => this.setClickedNumberOfStars(4)}
                      onMouseEnter={() => this.setNumberOfStars(4)} data-glyph="star"/>
                <span className={"oi" + (this.state.numberOfStars > 4 || (this.state.numberOfStars === 0 && this.state.savedValue > 4) ? ' active' : '')}
                      onClick={() => this.setClickedNumberOfStars(5)}
                      onMouseEnter={() => this.setNumberOfStars(5)} data-glyph="star"/>
            </div>
        );
    }
}
