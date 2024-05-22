# Google Apps Script: Data Consolidation

## Overview

This Google Apps Script consolidates data from multiple sheets within a Google Spreadsheet and merges them into a single sheet in the active spreadsheet. It processes data for the past 36 months and adds 'Month' and 'Year' columns to the consolidated data.

## Functions

### `consolidateData`

Main function that retrieves and consolidates data from a specified Google Spreadsheet.

### `getAllDataForYear`

Retrieves all data for a given year from the source spreadsheet.

### `getEndOfWeek`

Calculates the end date of the week for a given date.

### `getSourceSpreadsheet`

Retrieves the source spreadsheet using its ID from script properties.

### `setSourceSpreadsheetId`

Utility function to set the source spreadsheet ID (run once to set and then delete).

## Setup

1. **Add the Script Properties:**

   Run the `setSourceSpreadsheetId` function once to set the source spreadsheet ID. This function stores the ID in script properties for secure access.

   ```javascript
   function setSourceSpreadsheetId() {
     var properties = PropertiesService.getScriptProperties();
     properties.setProperty('SPREADSHEET_ID', 'YOUR_SPREADSHEET_ID_HERE');
   }