import React from 'react';
import Wrapper from '../components/wrapper';

export default class Blog extends React.Component {
  render() {
    return (
      <Wrapper title="Blog">
        <div className="content">Where I write things</div>
      </Wrapper>
    );
  }
}
