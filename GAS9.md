# Google Apps Script: Unworked Leads

## Overview

This Google Apps Script processes data from Keap CRM to find unworked leads from the previous week. The script fetches contact information from the CRM, filters the data based on specific criteria, and updates the Google Spreadsheet with the relevant information.

## Functions

### `processUnworkedLeads`

Main function that processes and finds unworked leads from the previous week and updates the Google Spreadsheet.

### `getKeapApiKey`

Retrieves the Keap API key from script properties.

### `processContactInfo`

Processes individual contact information and appends relevant data to the arrayData.

## Setup

1. **Set the Keap API Key:**

   Run the `setKeapApiKey` function once to set the Keap API key in script properties. This function stores the key securely.

   ```javascript
   function setKeapApiKey() {
     var properties = PropertiesService.getScriptProperties();
     properties.setProperty('KEAP_API_KEY', 'YOUR_KEAP_API_KEY_HERE');
   }
