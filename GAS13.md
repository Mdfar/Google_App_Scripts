# Google Apps Script: Totals Data

## Overview

This Google Apps Script retrieves and processes totals data from multiple Google Analytics accounts over various timeframes. The script fetches data from the Google Analytics API, processes the response, and updates a specified Google Spreadsheet with the relevant information.

## Functions

### `fetchAndProcessTotals`

Main function that retrieves and processes totals data from multiple Google Analytics accounts and updates the Google Spreadsheet.

### `processReportData`

Processes the report data and adds the account ID and timeframe to each row.

### `calculateDateOffset`

Calculates the date with the specified offset.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `fetchAndProcessTotals` Function:**

   Execute the `fetchAndProcessTotals` function to fetch the data from the Google Analytics API and update the spreadsheet with the totals data.

## Usage

### 1. `fetchAndProcessTotals`

Fetches totals data from multiple Google Analytics accounts over various timeframes and updates the specified Google Spreadsheet.

### 2. `processReportData`

Helper function to process the report data and add the account ID and timeframe to each row.

### 3. `calculateDateOffset`

Helper function to calculate the date with the specified offset.

## Notes

- Ensure that the "OrganicDateStat" sheet exists in the Google Spreadsheet.
- The script assumes that the necessary Google Analytics API services are enabled and authenticated.
- Customize the `accounts`, `dimensions`, `metrics`, and `timeframes` arrays as needed to fit your specific requirements.
- Check the logs in the Google Apps Script editor to see any error messages or additional information.
