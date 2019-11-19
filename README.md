# jamesjarvis.io

Welcome to jamesjarvis.io - my personal site, accessible at (you guessed it!) https://jamesjarvis.io

Been meaning to make one for ages.

To test locally, clone the repo, then run the following:

```bash
yarn
yarn start
```

If you want to copy this for yourself, its pretty simple to set it up completely for your own purposes.
After you have cloned the repository, and would like to set up the github actions CI/CD on github pages, just follow these instructions:
https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-gatsby

Some small additions to that for this particular project:

- There is CI/CD set up. It used to be run on circleci, but I have since moved it over to github actions because its just SO. DAMN. FRIENDLY.
- I have a custom domain on github pages (🌟 to whoever guesses what it is), and as a result you have to enter a CNAME file with the custom domain.
