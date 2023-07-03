import React, { Component } from 'react';

class IncrementAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentDidMount() {
    const { targetValue, duration } = this.props;
    const increment = Math.ceil(targetValue / (duration / 10));
    let currentValue = 0;

    this.intervalId = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(this.intervalId);
      }
      this.setState({ value: currentValue });
    }, 10);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { value } = this.state;
    return <span className='valueScore'>{value}</span>;
  }
}

export default IncrementAnimation;