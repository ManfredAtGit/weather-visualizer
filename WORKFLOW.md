# Weather Forecast Monitor Workflow

## 1. Overall Purpose of the Weather Forecast Monitor Programs

The Weather Forecast Monitor consists of a suite of programs (python, jupyter notebooks, github workflows/tasks, web app) which retrieves and analyses forecasts data from dwd (Deutscher Wetterdienst) and finally presents the results is an interactive web application.

## 2. Components of the workflow

The workflow consists of the following components:

- github workflow/task to retrieve daily forcasts (MOSMIX-L files) from dwd and store in repository
- python jupyter notebook to download files from github repository , unzip, rename and store on local disk
- python jupyter notebook to analyse forecast files from local disc and create forecast aggregates
- web app to display analysis results 

## 2.1 github workflow dwd-mosmix-downloader

A github repository with one .github/workflow download-dwd.yml. download-dwd.yml run daily and downloads the latest dwd forecast file MOSMIX-l from thw dwd site into the repositories subdirectory ./dwd.

## 2.2 local clone of dwd-mosmix-downloader

The local clone is located somewhere on the users local pc subdirectory D:\00-programming\dwd-mosmix-downloader. It servers as a means to simplify downloading repo-files (from 2.2) to local computer (see 2.3). 

## 2.3 python jupyter notebook DownloadMosmixRepoFiles

This jupyter notebook DownloadMosmixRepoFiles.ipynb is located on the users local pc ind subdirectory AnacondaProjects/Geo/weather. It can run on a on-demand basis. When run, it pulls the github repository (with all daily dwd-files downloaded since last pull). It unzips each Mosmix-L-***.kmz file, renames it to Vorhersagedaten_10416_<creation_date>.kml and moves the renamed file to the ./repo_data  subdirectory for further processing in the next step. After successfully completing this for all downloaded files, the ./dwd subdirectory of the cloned repository is cleared and the repository is pushed against github.

## 2.4 python jupyter notebook Mosmix_Aggr.ipynb

This is the main step to analyse the dwd weather forecast data and to generate forecast aggregates, forecast backtraces and quality measures for weather forecasts.

This notebook can't run autonomously/automatically yet but must be baby-walked step-by-step.

Major steps are
- reading and parsing and the kml-files from input diretory
- generating daily aggregate forecasts measures (numeric, categorial, symbolic) from hourly input data
- merging results from previous runs with currently calculated daily data (new)
- saving intermediate and final results
- grouping forecasts from different origin-dates (creation_date) with respect to same forecast date (prog_date)
 and calculate absolute error for forecast measures in relation to true-value. As we don't have the true values, we take the value of dates closest to prog_date as an approximation for the truth.
- finally for each "lag" or forecast timespan (prog_date - creation_date) we calculate the mean absolute error of the measures between "true-value" and forecated value. We save the results in local file for further processing.

## 2.5 web app weather-visualizer

The weather-visualizer app takes the results from the previouse step for vizualization purposes.
(further details see README.md)
