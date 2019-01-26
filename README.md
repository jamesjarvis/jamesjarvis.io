# jamesjarvis.io

Welcome to jamesjarvis.io - my personal site, accessible at (you guessed it!) https://jamesjarvis.io

Been meaning to make one for ages.

To test locally, clone the repo, then run the following:

```bash
yarn
yarn start
```

If you want to copy this for yourself, its pretty simple to set it up completely for your own purposes.
After you have cloned the repository, and would like to set up the circleci CI/CD on github pages, just follow these instructions:
https://github.com/DevProgress/onboarding/wiki/Using-Circle-CI-with-Github-Pages-for-Continuous-Delivery

Some small additions to that for this particular project:

- My deployer account is @jamesjarvis-io-deployer because I didn't want to give circli ssh access to all of my repositories!
- I have some circleci environment variables (you can spot within the deploy.sh file) - called GH_NAME and GH_EMAIL. This is just used for when you are committing and can be set to whatever.
- I have a custom domain on github pages (🌟 to whoever guesses what it is), and as a result you have to enter a CNAME file with the custom domain.
