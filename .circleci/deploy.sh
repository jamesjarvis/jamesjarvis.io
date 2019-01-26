#!/usr/bin/env bash

set -e

git clone $CIRCLE_REPOSITORY_URL out

cd out
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cp ./CNAME /tmp/CNAME || echo "No CNAME file"
git rm -rf .
cp /tmp/CNAME ./CNAME || echo "No CNAME file"
cd ..

yarn build

cp -a public/. out/.

mkdir -p out/.circleci && cp -a .circleci/. out/.circleci/.
cd out

git add -A
git commit -m "Automated deployment to GitHub Pages: ${CIRCLE_SHA1}" --allow-empty

git push origin $TARGET_BRANCH
