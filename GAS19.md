# Google Apps Script: Facebook Ads Data

## Overview

This Google Apps Script retrieves and processes Facebook Ads data for multiple accounts. The script fetches data from the Facebook Ads API, processes the response, and updates a specified Google Sheet with the relevant information.

## Functions

### `fetchFacebookAdsData`

Main function that retrieves and processes Facebook Ads data for multiple accounts and updates the Google Sheet.

### `processFacebookData`

Processes the Facebook Ads data and appends it to the result array.

### `calculateDate`

Calculates the date with the specified offset.

### `fetchData`

Fetches data from the specified URL.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `fetchFacebookAdsData` Function:**

   Execute the `fetchFacebookAdsData` function to fetch the data from the Facebook Ads API and update the sheet with the data.

## Usage

### 1. `fetchFacebookAdsData`

Fetches Facebook Ads data for multiple accounts and updates the specified Google Sheet.

### 2. `processFacebookData`

Helper function to process the Facebook Ads data and append it to the result array.

### 3. `calculateDate`

Helper function to calculate the date with the specified offset.

### 4. `fetchData`

Helper function to fetch data from the specified URL.

## Notes

- Ensure that the "Accounts" and "FBData" sheets exist in the Google Spreadsheet.
- The script assumes that the necessary Facebook Ads API services are enabled and authenticated.
- Customize the `accounts` and `fields` arrays as needed to fit your specific requirements.
- Check the logs in the Google Apps Script editor to see any error messages or additional information.
