import React from 'react';
import Wrapper from '../components/wrapper';

export default class Really extends React.Component {
  render() {
    return (
      <Wrapper title="Really Me">
        <div className="content">This is really me</div>
      </Wrapper>
    );
  }
}
