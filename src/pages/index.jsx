import React from "react";
import Wrapper from "../components/containers/wrapper";
import Me from "../components/me/me";

const Index = () => (
  <Wrapper title="Home">
    <main id={"landing"}>
      <Me showDescription />
    </main>
  </Wrapper>
);

export default Index;
