---
type: project
date: "2020-03"
title: "📈 COVID-19 (Coronavirus) automatic predictions"
tech: ["Python"]
source: "https://github.com/jamesjarvis/corona-infection-prediction-uk"
---

![Confirmed COVID-19 cases prediction](https://raw.githubusercontent.com/jamesjarvis/corona-infection-prediction-uk/master/plots/logistical/confirmedcases/logistic-plot.png)

This project was a slightly morbid experiment with data plotting and predictions.

The idea was to have a set of graphs that can automatically update as new data is published, since the coronavirus pandemic is such a rapidly changing event.
A Python script was written to collect the latest data from [John Hopkins University's repo](https://github.com/CSSEGISandData/COVID-19), and generate graphs (both exponential and logistical curve predictions) based on this data.

Then, using the wonderful [GitHub Actions](https://github.com/features/actions), this script was rerun every hour, and if the graphs generated were different to previously, it would automatically commit and push these changes to the repo.

I am not en expert, I'm just curious with how well the data can predict the future.

Another morbid graph (if you want to check out the previous predictions, you are welcome to go through the repo's history to see how well it predicted as time progressed):

![Confirmed COVID-19 related deaths prediction](https://raw.githubusercontent.com/jamesjarvis/corona-infection-prediction-uk/master/plots/logistical/deaths/logistic-plot.png)
