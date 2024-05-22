# Google Apps Script: WorldFengur API

## Overview

This Google Apps Script fetches data from the WorldFengur API using a specified FEIF ID and logs the response. The script handles API requests, processes the response, and logs the data or any errors encountered during the request.

## Functions

### `fetchWorldFengurData`

Main function that fetches data from the WorldFengur API and logs the response.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Run the `fetchWorldFengurData` Function:**

   Execute the `fetchWorldFengurData` function to fetch the data from the WorldFengur API and log the response.

## Usage

### 1. `fetchWorldFengurData`

Fetches data from the WorldFengur API using the specified FEIF ID and logs the response. If the response code is not 200, it logs an error message with the response code.

## Notes

- Ensure that the WorldFengur API endpoint is correct and accessible.
- The script uses a hardcoded FEIF ID (`IS2015287660`). Update the URL if you need to fetch data for a different horse.
- Check the logs in the Google Apps Script editor to see the fetched data or any error messages.
