import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, graphql, useStaticQuery } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Socials from "../socials/socials";
import "./me.scss";

const Me = ({ data, showDescription }) => {
  const {
    site: {
      siteMetadata: {
        author: { name, title, email },
        socials,
      },
    },
    bio: { html },
    avatarImg: {
      childImageSharp: { avatar },
    },
  } = useStaticQuery(query);

  const [rick, setRick] = useState(0);
  const metaAvatar = (children) =>
    showDescription ? (
      children
    ) : (
      <Link to="/" title="Oh look it's me" rel="me" className="u-url u-uid">
        {children}
      </Link>
    );

  return (
    <section id={"me"} className="h-card">
      {rick < 3 ? (
        <div
          className={"avatar animate fadeInUp one"}
          onClick={() => setRick(rick + 1)}
        >
          {metaAvatar(
            <GatsbyImage image={avatar} title={"Oh look it's me"} className={"u-logo u-photo"} />
          )}
        </div>
      ) : (
        <img
          src="https://media.giphy.com/media/LXONhtCmN32YU/giphy.gif"
          className={"rick"}
          alt="Internet memes die hard"
          title="Internet memes die hard"
        />
      )}
      <h1 id={"name"} className={"animate fadeInUp two p-name"}>
        <Link to="/" className="u-url u-uid nolinkstyle" rel="me">
          {name}
        </Link>
      </h1>
      <h2 id={"title"} className={"animate fadeInDown two p-job-title"}>
        {title}
      </h2>
      {showDescription && (
        <summary
          className={`animate fadeInUp two p-note`}
          id={"bio"}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      <Socials socials={socials} email={email} />
    </section>
  );
};

const query = graphql`{
  site {
    siteMetadata {
      author {
        name
        title
        email {
          address
          text
          body
          subject
        }
      }
      socials {
        icon
        text
        url
      }
    }
  }
  bio: markdownRemark(frontmatter: {type: {eq: "about"}}) {
    html
  }
  avatarImg: file(relativePath: {eq: "avatar.jpg"}) {
    childImageSharp {
      avatar: gatsbyImageData(width: 200, quality: 70, layout: CONSTRAINED)
    }
  }
}
`;

Me.defaultProps = {
  showDescription: false,
};

Me.propTypes = {
  showDescription: PropTypes.bool,
};

export default Me;
