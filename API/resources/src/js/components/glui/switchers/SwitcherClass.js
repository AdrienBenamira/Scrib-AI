import React, {Component, cloneElement} from 'react';

export default class SwitcherClass extends Component {
    constructor() {
        super();
        this.element = null;

        this.state = {
            active: false
        };

        this.handleClickTrigger = this.handleClickTrigger.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
    }

    handleClickTrigger() {
        const active = !this.state.active;
        this.setState({active});
    }

    handleClickOutside(event) {
        if (this.element && !this.element.contains(event.target)) {
            this.setState({active: false});
        }
    }

    componentDidMount() {
        document.getElementById(this.props.trigger).addEventListener('click', this.handleClickTrigger);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.getElementById(this.props.trigger).removeEventListener('click', this.handleClickTrigger);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.element = node;
    }

    render() {
        let className = this.props.children.props.className ? this.props.children.props.className : '';
        className = this.state.active ? className + " " + this.props.className : className;
        return cloneElement(this.props.children, {className, ref: this.setWrapperRef});
    }
}
