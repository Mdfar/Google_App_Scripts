/**
 * Main function to retrieve and process Facebook Ads data for multiple accounts.
 */
function fetchFacebookAdsData() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const actSheet = ss.getSheetByName('Accounts');
      const accounts = actSheet.getRange(2, 1, actSheet.getLastRow() - 1, 1).getValues().flat();
      const sheet = ss.getSheetByName('FBData');
      const lastRow = sheet.getLastRow();
      const period = `time_range[since]=${calculateDate(0, -12, 0, 1)}&time_range[until]=${calculateDate(0, 0, 0, -1)}`;
  
      const result = [];
  
      accounts.forEach(account => {
        let url = `https://graph.facebook.com/v19.0/${account}/insights?level=adset&${period}&time_increment=1&fields=campaign_name,campaign_id,adset_name,inline_link_clicks,spend,video_p25_watched_actions,video_p100_watched_actions,purchase_roas&limit=5000`;
        let response = fetchData(url);
        let responseData = JSON.parse(response.getContentText());
  
        if (response.getResponseCode() === 200) {
          processFacebookData(responseData, account, result);
          try {
            while (responseData.paging['next']) {
              url = responseData.paging['next'];
              response = fetchData(url);
              responseData = JSON.parse(response.getContentText());
              processFacebookData(responseData, account, result);
            }
          } catch (e) {
            Logger.log('Error processing pagination: ' + e.message);
          }
        } else {
          Logger.log('Error fetching data: ' + response.getResponseCode());
        }
      });
  
      if (result.length >= lastRow) {
        sheet.getRange(2, 1, result.length, result[0].length).setValues(result);
      } else {
        sheet.getRange(2, 1, result.length, result[0].length).setValues(result);
        const rest = lastRow - result.length;
        if (rest > 0) {
          try {
            sheet.deleteRows(result.length + 2, rest);
          } catch (e) {
            Logger.log('Error deleting rows: ' + e.message);
          }
        }
      }
    } catch (error) {
      Logger.log('Error in fetchFacebookAdsData: ' + error.message);
    }
  }
  
  /**
   * Processes the Facebook Ads data and appends it to the result array.
   * @param {Object} responseData - The response data from the Facebook API.
   * @param {string} account - The account ID.
   * @param {Array} result - The array to store the processed data.
   */
  function processFacebookData(responseData, account, result) {
    responseData.data.forEach(row => {
      const fields = ['campaign_id', 'campaign_name', 'adset_name', 'inline_link_clicks', 'spend', 'video_p25_watched_actions', 'video_p100_watched_actions', 'purchase_roas', 'date_start', 'date_stop'];
      const data = fields.map(field => {
        if (field === 'purchase_roas') {
          return row[field]?.reduce((acc, item) => acc + parseFloat(item.value), 0) || 0;
        }
        return row[field] || '';
      });
      data.push(account);
      result.push(data);
    });
  }
  
  /**
   * Calculates the date with the specified offset.
   * @param {number} dayOffset - The day offset.
   * @param {number} monthOffset - The month offset.
   * @param {number} yearOffset - The year offset.
   * @param {number} dateFlag - The date flag to determine the end date.
   * @return {string} The calculated date in 'yyyy-MM-dd' format.
   */
  function calculateDate(dayOffset, monthOffset, yearOffset, dateFlag) {
    const currentDate = new Date();
    const timezone = Session.getScriptTimeZone();
    let dateChange;
  
    if (dateFlag === -1) {
      dateChange = new Date(currentDate.getFullYear() + yearOffset, currentDate.getMonth() + monthOffset, currentDate.getDate() + dayOffset);
    } else {
      dateChange = new Date(currentDate.getFullYear() + yearOffset, currentDate.getMonth() + monthOffset, dateFlag);
    }
  
    return Utilities.formatDate(dateChange, timezone, "yyyy-MM-dd");
  }
  
  /**
   * Fetches data from the specified URL.
   * @param {string} url - The URL to fetch data from.
   * @return {HTTPResponse} The response from the URL fetch.
   */
  function fetchData(url) {
    const options = {
      'method': 'GET',
      'muteHttpExceptions': true
    };
    return UrlFetchApp.fetch(url, options);
  }
  