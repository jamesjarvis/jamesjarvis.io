import React from 'react';
import { Link } from 'gatsby';
import Scramble from 'react-scramble';
import PropTypes from 'prop-types';
import './name.scss';

export default class Name extends React.Component {
  render() {
    return (
      <div className="nameWrapper">
        {this.props.words.map(word => {
          const link = word.faint ? '/really' : '/';
          return (
            <Link to={link} className={`line ${word.faint ? 'faint' : ''}`}>
              <Scramble
                className={`line`}
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
            </Link>
          );
        })}
      </div>
    );
  }
}

Name.propTypes = {
  words: PropTypes.array.isRequired,
};
