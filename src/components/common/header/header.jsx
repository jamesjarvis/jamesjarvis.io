import React, { useContext } from "react";
import "../../../styles/codestyle.scss";
import CodeContext from "../CodeContext";
import "./header.scss";
import NavBar from "./navbar";

const Header = () => {
  const { language } = useContext(CodeContext);
  return (
    <header className="translucent">
      <NavBar language={language} />
    </header>
  );
};

export default Header;
