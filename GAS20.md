# Google Apps Script: Bing Ads Campaign Statistics

## Overview

This Google Apps Script retrieves and processes campaign statistics from the Bing Ads API. The script sends a SOAP request to the Bing Ads API, processes the response, and returns the campaign statistics.

## Functions

### `fetchCampaignStats`

Main function that retrieves and processes campaign statistics from the Bing Ads API and returns the campaign statistics.

## Setup

1. **Deploy the Script:**

   Deploy the script in your Google Apps Script environment.

2. **Set User Properties:**

   Ensure that the user properties include the `access_token` required for authentication with the Bing Ads API.

3. **Run the `fetchCampaignStats` Function:**

   Execute the `fetchCampaignStats` function to fetch the campaign statistics from the Bing Ads API and return the data.

## Usage

### 1. `fetchCampaignStats`

Fetches campaign statistics from the Bing Ads API and returns the data.

## Notes

- Ensure that the necessary Bing Ads API services are enabled and authenticated.
- Customize the `customerAccountId`, `customerId`, and `developerToken` as needed to fit your specific requirements.
- Check the logs in the Google Apps Script editor to see any error messages or additional information.
