import React from 'react';
import Name from './name/name';

export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <Name
          words={[
            { word: 'I', faint: false },
            { word: 'am', faint: false },
            { word: 'the', faint: true },
            { word: 'real', faint: true },
            { word: 'James', faint: false },
            { word: 'Jarvis', faint: false },
          ]}
        />
      </footer>
    );
  }
}
