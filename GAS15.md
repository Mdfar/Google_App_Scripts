# Google Apps Script: Google Ads Data

## Overview

This Google Apps Script retrieves and processes Google Ads data and conversions for multiple clients. The script fetches data from the Google Ads API, processes the response, and updates specified Google Sheets with the relevant information.

## Functions

### `fetchGoogleAdsData`

Main function that retrieves and processes Google Ads data and conversions for multiple clients and updates the Google Sheets.

### `buildMetrics`

Builds the metrics string for the request.

### `requestWork`

Mock function to simulate the request and retrieval of data. Replace this with the actual function to fetch data from the API.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `fetchGoogleAdsData` Function:**

   Execute the `fetchGoogleAdsData` function to fetch the data from the Google Ads API and update the sheets with the data and conversion information.

## Usage

### 1. `fetchGoogleAdsData`

Fetches Google Ads data and conversions for multiple clients and updates the specified Google Sheets.

### 2. `buildMetrics`

Helper function to build the metrics string for the request.

### 3. `requestWork`

Helper function to simulate the request and retrieval of data. Replace this with the actual function to fetch data from the API.

## Notes

- Ensure that the "GADS" and "GADSConv" sheets exist in the Google Spreadsheet.
- The script assumes that the necessary Google Ads API services are enabled and authenticated.
- Customize the `clients`, `metrics`, and `metricsConv` arrays as needed to fit your specific requirements.
- Check the logs in the Google Apps Script editor to see any error messages or additional information.
