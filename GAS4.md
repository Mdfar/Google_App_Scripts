# Google Apps Script: Primary Health Clients Data Processing

## Overview

This Google Apps Script processes data from a Google Spreadsheet to generate commissionable data for primary health clients. The script filters health data based on specified criteria and aggregates the results for each PBM (Pharmacy Benefit Manager).

## Functions

### `processPrimaryHealthClients`

Main function that processes primary health clients and generates commissionable data.

### `getNonEmptyPBMs`

Filters non-empty PBM values from the given list.

### `filterHealthData`

Filters health data based on person type, health status, and application status.

### `filterRecordsByPBM`

Filters records by a specific PBM.

### `filterRecordsExcludingPBMs`

Filters records excluding specific PBMs.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `processPrimaryHealthClients` Function:**

   Execute the `processPrimaryHealthClients` function to process the data and generate the commissionable client report.

## Usage

### 1. `processPrimaryHealthClients`

Processes data from the "Primary Commissionable Clients" and "Health Raw Data" sheets to generate commissionable client data for each PBM.

### 2. `getNonEmptyPBMs`

Helper function to filter out non-empty PBM values from a list.

### 3. `filterHealthData`

Helper function to filter health data based on specific criteria including person type, health status, and application status.

### 4. `filterRecordsByPBM`

Helper function to filter records for a specific PBM.

### 5. `filterRecordsExcludingPBMs`

Helper function to filter records excluding a list of PBMs.