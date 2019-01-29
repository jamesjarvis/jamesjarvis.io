import React from 'react';
import Scramble from 'react-scramble';
import PropTypes from 'prop-types';
import './name.scss';

export default class Name extends React.Component {
  render() {
    return (
      <div className="nameWrapper">
        {this.props.words.map(word => (
          <Scramble
            className={`line ${word.faint ? 'faint' : ''}`}
            autoStart
            mouseEnterTrigger="restart"
            text={word.word}
            steps={[
              {
                roll: 10,
                action: '+',
                type: 'all',
              },
              {
                roll: 20,
                action: '-',
                type: 'forward',
              },
            ]}
          />
        ))}
      </div>
    );
  }
}

Name.propTypes = {
  words: PropTypes.array.isRequired,
};
