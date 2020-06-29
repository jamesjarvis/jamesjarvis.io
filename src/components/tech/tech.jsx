import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./tech.scss";
import CodeContext from "../common/CodeContext";

const Tech = ({ showHover, techs }) => {
  const { changeLanguage } = useContext(CodeContext);
  return (
    <div id={"techs"} className={"animate fadeInUp one"}>
      {techs.map((tech, id) => (
        <span
          key={tech}
          className={"tech"}
          onMouseOver={() => changeLanguage(tech)}
          onFocus={() => changeLanguage(tech)}
          onClick={() => changeLanguage(tech)}
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

Tech.defaultProps = {
  showHover: false,
};

Tech.propTypes = {
  showHover: PropTypes.bool,
  techs: PropTypes.array.isRequired,
};

export default Tech;
