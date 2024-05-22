# Google Apps Script: Health Lost Clients Report

## Overview

This Google Apps Script processes health data from a Google Spreadsheet to generate a report of lost clients. The script filters health data based on specified criteria and aggregates the results for each PBM (Pharmacy Benefit Manager) by month and year.

## Functions

### `processHealthLostClients`

Main function that processes health data and generates a report of lost clients.

### `getNonEmptyPBMs`

Filters non-empty PBM values from the given list.

### `filterRecordsByYear`

Filters records for a specific year.

### `filterRecordsByMonth`

Filters records for a specific month within a year.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `processHealthLostClients` Function:**

   Execute the `processHealthLostClients` function to process the data and generate the lost clients report.

## Usage

### 1. `processHealthLostClients`

Processes data from the "Primary Commissionable Clients" and "Health Raw Data" sheets to generate a lost clients report for each PBM by month and year.

### 2. `getNonEmptyPBMs`

Helper function to filter out non-empty PBM values from a list.

### 3. `filterRecordsByYear`

Helper function to filter records for a specific year.

### 4. `filterRecordsByMonth`

Helper function to filter records for a specific month within a year.