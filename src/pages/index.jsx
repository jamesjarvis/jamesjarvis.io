import React from 'react';
import Wrapper from '../components/containers/wrapper';
import Me from '../components/me/me';

export default class Index extends React.Component {
  render() {
    return (
      <Wrapper title="Home">
        <div id={'landing'}>
          <Me showDescription />
        </div>
      </Wrapper>
    );
  }
}
