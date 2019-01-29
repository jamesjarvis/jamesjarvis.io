import React from 'react';
import Name from './name/name';

export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <Name
          words={[
            { word: 'I', faint: false },
            { word: 'Am', faint: false },
            { word: 'The', faint: true },
            { word: 'Real', faint: true },
            { word: 'James', faint: false },
            { word: 'Jarvis', faint: false },
          ]}
        />
      </footer>
    );
  }
}
