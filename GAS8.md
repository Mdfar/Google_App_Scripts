# Google Apps Script: MGA Data by Carrier

## Overview

This Google Apps Script processes MGA data by carrier from a Google Spreadsheet to generate a report of clients by carrier and PBM (Pharmacy Benefit Manager). The script filters MGA data based on specified criteria and updates the spreadsheet with the processed data.

## Functions

### `processMGADataByCarrier`

Main function that processes MGA data by carrier and updates the Google Spreadsheet.

### `getNonEmptyPBMs`

Filters non-empty PBM values from the given list.

### `insertNewPBMs`

Inserts new PBMs into the data arrays at the appropriate positions.

### `updateSheetWithNewPBMs`

Updates the spreadsheet with new PBM values and adjusted data arrays.

### `filterMGARecords`

Filters MGA records based on person type and application status.

### `getUniqueCarriers`

Retrieves unique carrier names from the data sheet.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `processMGADataByCarrier` Function:**

   Execute the `processMGADataByCarrier` function to process the data and update the spreadsheet with the MGA data by carrier report.

## Usage

### 1. `processMGADataByCarrier`

Processes data from the "MGA_Clients_Carrier" and "MGA Raw Data" sheets to generate an MGA data report by carrier for each PBM.

### 2. `getNonEmptyPBMs`

Helper function to filter out non-empty PBM values from a list.

### 3. `insertNewPBMs`

Helper function to insert new PBM values into the data arrays.

### 4. `updateSheetWithNewPBMs`

Helper function to update the spreadsheet with new PBM values and adjusted data arrays.

### 5. `filterMGARecords`

Helper function to filter MGA records based on person type and application status.

### 6. `getUniqueCarriers`

Helper function to retrieve unique carrier names from the data sheet.