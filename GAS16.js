/**
 * Main function to retrieve and process Google Ads keyword data and conversions for multiple clients.
 */
function fetchGoogleAdsKeywords() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("Keyword");
      const lastRow = sheet.getLastRow();
      const sheetConv = ss.getSheetByName("KeywordConv");
      const lastRowConv = sheetConv.getLastRow();
  
      const clients = ['5673827788', '9423733573', '8971426925', '1406017585', '4866707174'];
      let rest = 1;
      let restConv = 1;
  
      clients.forEach(clientId => {
        const metrics = 'date,customerID,keyword,matchType,cost,impression';
        const metricsConv = 'date,customerID,keyword,matchType,actionType,conversion,vtConversion,salesRevenue';
  
        const data = requestWork(clientId, 'keyword_view', buildMetrics(metrics));
        const dataConv = requestWork(clientId, 'keyword_view', buildMetrics(metricsConv));
  
        if (data.length > 0) {
          sheet.getRange(rest + 1, 1, data.length, data[0].length).setValues(data);
        }
        rest += data.length;
  
        if (dataConv.length > 0) {
          sheetConv.getRange(restConv + 1, 1, dataConv.length, dataConv[0].length).setValues(dataConv);
        }
        restConv += dataConv.length;
      });
  
      if (lastRow > rest) {
        try {
          sheet.deleteRows(rest + 1, lastRow - rest);
        } catch (e) {
          Logger.log('Error deleting rows in Keyword sheet: ' + e.message);
        }
      }
  
      if (lastRowConv > restConv) {
        try {
          sheetConv.deleteRows(restConv + 1, lastRowConv - restConv);
        } catch (e) {
          Logger.log('Error deleting rows in KeywordConv sheet: ' + e.message);
        }
      }
  
    } catch (error) {
      Logger.log('Error in fetchGoogleAdsKeywords: ' + error.message);
    }
  }
  
  /**
   * Builds the metrics string for the request.
   * @param {string} metrics - The metrics string.
   * @return {Array} The metrics array.
   */
  function buildMetrics(metrics) {
    return metrics.split(',').map(metric => metric.trim());
  }
  
  /**
   * Mock function to simulate the request and retrieval of data.
   * Replace this with the actual function to fetch data from the API.
   * @param {string} clientId - The client ID.
   * @param {string} reportType - The type of report (e.g., 'keyword_view').
   * @param {Array} metrics - The metrics to include in the request.
   * @return {Array} The data retrieved from the API.
   */
  function requestWork(clientId, reportType, metrics) {
    // Mock implementation
    // Replace with the actual implementation to fetch data from the API
    Logger.log(`Requesting ${reportType} report for client ${clientId} with metrics: ${metrics.join(', ')}`);
    return [];
  }  