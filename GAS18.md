# Google Apps Script: Facebook Ads Summary Data

## Overview

This Google Apps Script retrieves and processes Facebook Ads summary data for multiple accounts. The script fetches data from the Facebook Ads API, processes the response, and updates a specified Google Sheet with the relevant information.

## Functions

### `fetchFacebookAdsSummary`

Main function that retrieves and processes Facebook Ads summary data for multiple accounts and updates the Google Sheet.

### `calculateDate`

Calculates the date with the specified offset.

### `fetchData`

Fetches data from the specified URL.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `fetchFacebookAdsSummary` Function:**

   Execute the `fetchFacebookAdsSummary` function to fetch the data from the Facebook Ads API and update the sheet with the summary data.

## Usage

### 1. `fetchFacebookAdsSummary`

Fetches Facebook Ads summary data for multiple accounts and updates the specified Google Sheet.

### 2. `calculateDate`

Helper function to calculate the date with the specified offset.

### 3. `fetchData`

Helper function to fetch data from the specified URL.

## Notes

- Ensure that the "Accounts" and "FBSummary" sheets exist in the Google Spreadsheet.
- The script assumes that the necessary Facebook Ads API services are enabled and authenticated.
- Customize the `accounts`, `periods`, and `fields` arrays as needed to fit your specific requirements.
- Check the logs in the Google Apps Script editor to see any error messages or additional information.
