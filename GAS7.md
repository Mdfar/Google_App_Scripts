# Google Apps Script: Health Data by Carrier

## Overview

This Google Apps Script processes health data by carrier from a Google Spreadsheet to generate a report of clients by carrier and PBM (Pharmacy Benefit Manager). The script filters health data based on specified criteria and updates the spreadsheet with the processed data.

## Functions

### `processHealthDataByCarrier`

Main function that processes health data by carrier and updates the Google Spreadsheet.

### `getNonEmptyPBMs`

Filters non-empty PBM values from the given list.

### `insertNewPBMs`

Inserts new PBMs into the data arrays at the appropriate positions.

### `updateSheetWithNewPBMs`

Updates the spreadsheet with new PBM values and adjusted data arrays.

### `filterHealthRecords`

Filters health records based on person type and application status.

### `getUniqueCarriers`

Retrieves unique carrier names from the data sheet.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `processHealthDataByCarrier` Function:**

   Execute the `processHealthDataByCarrier` function to process the data and update the spreadsheet with the health data by carrier report.

## Usage

### 1. `processHealthDataByCarrier`

Processes data from the "Health_Clients_Carrier" and "Health Raw Data" sheets to generate a health data report by carrier for each PBM.

### 2. `getNonEmptyPBMs`

Helper function to filter out non-empty PBM values from a list.

### 3. `insertNewPBMs`

Helper function to insert new PBM values into the data arrays.

### 4. `updateSheetWithNewPBMs`

Helper function to update the spreadsheet with new PBM values and adjusted data arrays.

### 5. `filterHealthRecords`

Helper function to filter health records based on person type and application status.

### 6. `getUniqueCarriers`

Helper function to retrieve unique carrier names from the data sheet.
