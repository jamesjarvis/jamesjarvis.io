import React from 'react';
import Wrapper from '../components/wrapper';
import Me from '../components/me/me';

export default class Index extends React.Component {
  render() {
    return (
      <Wrapper title="Home">
        <Me />
        <h1 className="title animate fadeInUp one">Hi, Welcome to my site.</h1>
        <p className="content animate fadeInUp two">
          I'm just trying to think of things to put on here for now. If you would like to check back
          in a week or so, it should be a little more interesting (I promise).
        </p>
      </Wrapper>
    );
  }
}
