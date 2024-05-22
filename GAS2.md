# Google Apps Script: Health Data Integration

## Overview

This Google Apps Script fetches health data from an API and updates a specified Google Spreadsheet with the retrieved data. The script processes data in chunks and formats specific fields before storing them.

## Functions

### `fetchAndStoreHealthData`

Main function that retrieves health data from the API and updates the Google Spreadsheet.

### `buildApiUrl`

Constructs the API URL with the specified offset for pagination.

### `processContactEntry`

Processes a single contact entry from the API response and formats the data.

### `getKeapApiKey`

Retrieves the Keap API key from script properties.

### `setKeapApiKey`

Utility function to set the Keap API key. Run this function once to set the API key, and then delete it.

## Setup

1. **Set the Keap API Key:**

   Run the `setKeapApiKey` function once to set the Keap API key in script properties. This function stores the key securely.

   ```javascript
   function setKeapApiKey() {
     var properties = PropertiesService.getScriptProperties();
     properties.setProperty('KEAP_API_KEY', 'YOUR_KEAP_API_KEY_HERE');
   }