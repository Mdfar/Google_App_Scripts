/**
 * Main function to retrieve and process Facebook Ads summary data for multiple accounts.
 */
function fetchFacebookAdsSummary() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const actSheet = ss.getSheetByName('Accounts');
      const accounts = actSheet.getRange(2, 1, actSheet.getLastRow() - 1, 1).getValues().flat();
      const sheet = ss.getSheetByName('FBSummary');
      const lastRow = sheet.getLastRow();
  
      const periods = [
        'date_preset=today',
        'date_preset=yesterday',
        'date_preset=this_month',
        'date_preset=last_7d',
        'date_preset=last_14d',
        'date_preset=last_30d',
        'date_preset=last_month',
        'time_range[since]=' + calculateDate(-60, 0, 0, -1) + '&time_range[until]=' + calculateDate(-1, 0, 0, -1),
        'date_preset=last_90d',
        'time_range[since]=' + calculateDate(-180, 0, 0, -1) + '&time_range[until]=' + calculateDate(-1, 0, 0, -1),
        'time_range[since]=' + calculateDate(0, -12, 0, 1) + '&time_range[until]=' + calculateDate(0, 0, 0, -1)
      ];
      const periodNames = ["TODAY", "YESTERDAY", "THIS_MONTH", "LAST_7_DAYS", "LAST_14_DAYS", "LAST_30_DAYS", "LAST_MONTH", "LAST_60_DAYS", "LAST_90_DAYS", "LAST_180_DAYS", "THIS_12_MONTH"];
  
      const fields = ['impressions', 'reach', 'inline_link_clicks', 'spend', 'conversions', 'conversion_values', 'purchase_roas', 'video_play_actions', 'video_p25_watched_actions', 'video_p50_watched_actions', 'video_p75_watched_actions', 'video_p100_watched_actions', 'adset_name'];
      const result = [];
  
      accounts.forEach(account => {
        periods.forEach((period, periodIndex) => {
          const url = `https://graph.facebook.com/v19.0/${account}/insights?level=adset&${period}&default_summary=true&fields=${fields.join(',')}&limit=5000`;
  
          const response = fetchData(url);
          const responseData = JSON.parse(response.getContentText());
  
          try {
            responseData.data.forEach(row => {
              const data = fields.map(field => {
                if (field === 'video_play_actions') {
                  return row.video_play_actions ? row.video_play_actions.value : '';
                } else {
                  return row[field] || '';
                }
              });
              data.push(account, periodNames[periodIndex]);
              result.push(data);
            });
          } catch (e) {
            Logger.log('Error processing data rows: ' + e.message);
          }
  
          try {
            const summaryData = fields.map(field => {
              if (field === 'video_play_actions') {
                return responseData.summary?.video_play_actions?.value || '';
              } else if (field === "adset_name") {
                return '';
              } else {
                return responseData.summary[field] || '';
              }
            });
            summaryData.push('summary', account, periodNames[periodIndex]);
            result.push(summaryData);
          } catch (e) {
            Logger.log('Error processing summary data: ' + e.message);
          }
        });
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
      Logger.log('Error in fetchFacebookAdsSummary: ' + error.message);
    }
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
  