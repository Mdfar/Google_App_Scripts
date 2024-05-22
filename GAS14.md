# Google Apps Script: Session Sources Data

## Overview

This Google Apps Script retrieves and processes session sources data from multiple Google Analytics accounts. The script fetches data from the Google Analytics API, processes the response, and updates a specified Google Spreadsheet with the relevant information.

## Functions

### `fetchSessionSources`

Main function that retrieves and processes session sources data from multiple Google Analytics accounts and updates the Google Spreadsheet.

### `processReportData`

Processes the report data and adds the account ID to each row.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `fetchSessionSources` Function:**

   Execute the `fetchSessionSources` function to fetch the data from the Google Analytics API and update the spreadsheet with the session sources data.

## Usage

### 1. `fetchSessionSources`

Fetches session sources data from multiple Google Analytics accounts and updates the specified Google Spreadsheet.

### 2. `processReportData`

Helper function to process the report data and add the account ID to each row.

## Notes

- Ensure that the "Sheet8" sheet exists in the Google Spreadsheet.
- The script assumes that the necessary Google Analytics API services are enabled and authenticated.
- Customize the `accounts`, `dimensions`, and `metrics` arrays as needed to fit your specific requirements.
- Check the logs in the Google Apps Script editor to see any error messages or additional information.