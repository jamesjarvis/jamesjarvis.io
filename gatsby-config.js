const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

console.log(`Using environment config: '${activeEnv}'`);

require("dotenv").config({
    path: `.env.${activeEnv}`,
});

module.exports = {
    pathPrefix: "__GATSBY_IPFS_PATH_PREFIX__",
    siteMetadata: {
        title: `James Jarvis`,
        author: {
            name: `James Jarvis`,
            title: `Software Engineer, Explorer`,
            email: {
                address: "hello@jamesjarvis.io",
                text: "Say hi!",
                body: "Loved your website! Care to exchange information?",
                subject: "Just saw your site!",
            },
        },
        webmentionUrl: `https://webmention.io/jamesjarvis.io/webmention`,
        pingbackUrl: `https://webmention.io/jamesjarvis.io/xmlrpc`,
        siteUrl: `https://jamesjarvis.io`,
        description: `Personal site of James Jarvis`,
        socials: [{
                platform: "LinkedIn",
                icon: "linkedin-in",
                text: "Connect with me!",
                url: "https://www.linkedin.com/in/mrjamesjarvis/",
            },
            {
                platform: "GitHub",
                icon: "github",
                text: "Critique my code!",
                url: "https://github.com/jamesjarvis",
            },
            {
                platform: "Keybase",
                icon: "keybase",
                text: "View my proofs!",
                url: "https://keybase.io/jamesjarvis",
            },
            {
                platform: "Instagram",
                icon: "instagram",
                text: "Follow me!",
                url: "https://www.instagram.com/jamjarvis/",
            },
            {
                platform: "YouTube",
                icon: "youtube",
                text: "Watch my videos!",
                url: "https://www.youtube.com/c/JamesJarvis1998",
            },
        ],
        keywords: [
            "personal",
            "site",
            "portfolio",
            "developer",
            "software",
            "engineer",
            "film-maker",
            "One Second Every Day",
        ],
    },
    plugins: [
        // 'gatsby-plugin-ipfs',
        {
            resolve: `gatsby-plugin-gtag`,
            options: {
                trackingId: process.env.GA_TRACKING_ID,
                head: true,
                anonymize: true,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `content`,
                path: `${__dirname}/assets/content`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/assets/images`,
            },
        },
        {
            resolve: `gatsby-plugin-web-font-loader`,
            options: {
                google: {
                    families: ['Roboto Mono', 'Titillium Web'],
                },
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `James Jarvis`,
                short_name: `James Jarvis`,
                start_url: `/`,
                background_color: `#000000`,
                theme_color: `#004196`,
                display: `minimal-ui`,
                icon: `assets/images/avatar.jpg`, // This path is relative to the root of the site.
                include_favicon: true, // Include favicon
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [{
                        resolve: "gatsby-remark-embed-video",
                        options: {
                            width: 560,
                            ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
                            related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
                            noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
                            loadingStrategy: 'lazy', //Optional: Enable support for lazy-load offscreen iframes. Default is disabled.
                            urlOverrides: [{
                                    id: 'youtube',
                                    embedURL: (videoId) => `https://www.youtube-nocookie.com/embed/${videoId}`,
                                }] //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
                        }
                    },
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 800,
                            linkImagesToOriginal: true,
                            withWebp: true,
                            quality: 50
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            showLineNumbers: false,
                            // Customize the prompt used in shell output
                            // Values below are default
                            prompt: {
                                user: "root",
                                host: "localhost",
                                global: false,
                            },
                        },
                    },
                    'gatsby-remark-copy-linked-files',
                    'gatsby-remark-google-analytics-track-links'
                ],
            },
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-image`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        `gatsby-transformer-json`,
        `gatsby-plugin-sitemap`,
    ],
};