import React from 'react';
import PropTypes from 'prop-types';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AnimateHeight from 'react-animate-height';
import Socials from '../socials/socials';
import './me.scss';

class Me extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.toggleShow = this.toggleShow.bind(this);
  }

  toggleShow() {
    if (this.state.show) {
      this.setState({
        show: false,
      });
      return false;
    }
    this.setState({
      show: true,
    });
    return true;
  }

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => {
          const {
            info: { name, title, socials },
            bio: { html },
            avatarImg: {
              childImageSharp: { avatar },
            },
          } = data;
          const bioShow = this.state.show ? 'fadeInDown' : 'fadeOutUp';
          const arrowShow = this.state.show ? 'upsideDown' : 'upsideUp bounce';
          const metaAvatar = children =>
            this.props.showDescription ? children : <Link to="/">{children}</Link>;
          console.log(html);
          return (
            <section id={'me'}>
              <div className={'avatar animate fadeInUp one'} onClick={this.toggleShow}>
                {metaAvatar(<Img fluid={avatar} />)}
              </div>
              <h1 id={'name'} className={'animate fadeInUp two'}>
                {name}
              </h1>
              <h2 id={'title'} className={'animate fadeInDown two'}>
                {title}
              </h2>
              <hr className={`animate growWidth two`} />
              {this.props.showDescription && (
                <>
                  <AnimateHeight
                    duration={500}
                    delay={this.state.show ? 0 : 300}
                    height={this.state.show ? 'auto' : 0}
                  >
                    <summary
                      className={`animate ${bioShow}`}
                      id={'bio'}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </AnimateHeight>
                  <span
                    id={'arrow'}
                    className={`animate fadeInUp two`}
                    onClick={this.toggleShow}
                    tooltip="clickme"
                  >
                    <FontAwesomeIcon
                      icon="angle-down"
                      prefix={'fab'}
                      className={`animate ${arrowShow}`}
                    />
                  </span>
                </>
              )}
              <Socials socials={socials} />
            </section>
          );
        }}
      />
    );
  }
}

const query = graphql`
  query {
    info: aboutJson {
      name
      title
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
        avatar: fluid(maxWidth: 400, quality: 100) {
          ...GatsbyImageSharpFluid_tracedSVG
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
