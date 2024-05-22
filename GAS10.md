# Google Apps Script: Colored Chart

## Overview

This Google Apps Script processes data from a Google Spreadsheet to create a colored chart based on the data provided. The script extracts data, processes it, and visualizes it in a specified format with various colors.

## Functions

### `createColoredChart`

Main function that processes data and creates a colored chart.

### `buildMetrics`

Builds an array of metrics for the chart. This is a placeholder function as the original implementation details are not provided.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `createColoredChart` Function:**

   Execute the `createColoredChart` function to process the data and update the spreadsheet with the colored chart.

## Usage

### 1. `createColoredChart`

Processes data from the "Chart" sheet and generates a colored chart based on the data. Clears old data and updates the chart area with new values.

### 2. `buildMetrics`

Helper function to build an array of metrics for the chart. Placeholder implementation provided.

## Notes

- Ensure that the "Chart" sheet exists in the Google Spreadsheet.
- The script assumes that the data starts from cell A2 and spans columns A, B, and C.
- Customize the `buildMetrics` function as needed to fit your specific metric calculation logic.
