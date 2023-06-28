import React from "react";
import Wrapper from "../components/containers/wrapper";

const NotFoundPage = () => (
  <Wrapper title="404">
    <main id={"landing"}>
      <div className="middle">
        <span className="large">🤷‍♂️🤷‍♀️</span>
        <span className="medium">Nothing to see here...</span>
        <span className="small">404, go home</span>
      </div>
    </main>
  </Wrapper>
);

export default NotFoundPage;
