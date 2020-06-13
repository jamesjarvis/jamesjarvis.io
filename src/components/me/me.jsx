import React, {useState} from "react";
import PropTypes from "prop-types";
import { Link, graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image";
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

  const [rick, setRick] = useState(0)
  const metaAvatar = (children) =>
    showDescription ? children : <Link to="/">{children}</Link>;

  return (
    <section id={"me"}>
      {rick < 3 ? (
        <div
          className={"avatar animate fadeInUp one"}
          onClick={() => setRick(rick+1)}
        >
          {metaAvatar(<Img fluid={avatar} title={"Oh look it's me"} />)}
        </div>
      ) : (
        <img
          src="https://media.giphy.com/media/LXONhtCmN32YU/giphy.gif"
          className={"rick"}
          alt="Internet memes die hard"
          title="Internet memes die hard"
        />
      )}
      <h1 id={"name"} className={"animate fadeInUp two"}>
        {name}
      </h1>
      <h2 id={"title"} className={"animate fadeInDown two"}>
        {title}
      </h2>
      {showDescription && (
            <summary
              className={`animate fadeInUp two`}
              id={"bio"}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: html }}
            />
      )}
      <Socials socials={socials} email={email} />
    </section>
  );
};

const query = graphql`
  query {
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
    info: aboutJson {
      name
      title
      email {
        address
        subject
        body
        text
      }
      socials {
        icon
        url
        text
      }
    }
    bio: markdownRemark(frontmatter: { type: { eq: "about" } }) {
      html
    }
    avatarImg: file(relativePath: { eq: "images/avatar.jpg" }) {
      childImageSharp {
        avatar: fluid(maxWidth: 200, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
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
