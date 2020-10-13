import React from "react";
import PropTypes from "prop-types";
import Header from "../common/header/header";
import Footer from "../common/footer/footer";
import SEO from "../common/seo";
import "./wrapper.scss";

const Wrapper = ({ title, children, image, description, keywords }) => (
  <div id={"wrapper"}>
    <SEO
      title={title}
      image={image}
      description={description}
      keywords={keywords}
    />
    <Header />
    {children}
    <Footer />
  </div>
);

Wrapper.defaultProps = {
  title: null,
  image: null,
  description: null,
  keywords: null,
};

Wrapper.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }),
  keywords: PropTypes.arrayOf(PropTypes.string),
};

export default Wrapper;
