/**
 * Main function to retrieve and process session sources data from multiple Google Analytics accounts.
 */
function fetchSessionSources() {
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName('All Source Data');
      const lastRow = sheet.getLastRow();
      const accounts = ['249626375', '323071907', '293866968', '260385509', '296314637'];
      const dimensions = ['date', 'sessionMedium', 'sessionSource', 'sessionDefaultChannelGrouping'];
      const metrics = ['activeUsers', 'sessions', 'screenPageViews', 'averageSessionDuration', 'bounceRate', 'conversions', 'ecommercePurchases', 'purchaseRevenue', 'advertiserAdCost', 'returnOnAdSpend'];
      const currentDate = new Date();
      const firstDayOfLastYear = new Date(currentDate.getFullYear(), currentDate.getMonth() - 24, 1);
      const differenceInDays = Math.floor((currentDate - firstDayOfLastYear) / (1000 * 60 * 60 * 24));
      const startDate = `${differenceInDays}daysAgo`;
      let rest = 1;
  
      for (let i = 0; i < accounts.length; i++) {
        const propertyId = accounts[i];
        const limit = 50000; // Set your desired page size
        let offset = 0;
        let reportRows = 1;
  
        while (reportRows >= offset) {
          let data = [];
          const request = AnalyticsData.newRunReportRequest();
  
          request.dimensions = dimensions.map(dimensionName => {
            const dimension = AnalyticsData.newDimension();
            dimension.name = dimensionName;
            return dimension;
          });
  
          request.metrics = metrics.map(metricsName => {
            const metric = AnalyticsData.newMetric();
            metric.name = metricsName;
            return metric;
          });
  
          const dateRange = AnalyticsData.newDateRange();
          dateRange.startDate = startDate;
          dateRange.endDate = 'today';
          request.dateRanges = [dateRange];
  
          request.limit = limit;
          request.offset = offset;
  
          const orderByDate = AnalyticsData.newOrderBy();
          orderByDate.dimension = { dimensionName: 'date' }; // Assuming 'date' is the name of your date dimension
          orderByDate.desc = true; // Order by descending
          request.orderBys = [orderByDate];
  
          const report = AnalyticsData.Properties.runReport(request, 'properties/' + propertyId);
          data = processReportData(report, accounts[i]);
  
          if (data.length > 0) {
            sheet.getRange(rest + 1, 1, data.length, data[0].length).setValues(data);
          }
  
          rest += data.length;
          reportRows = report.rowCount;
          offset += limit;
        }
      }
  
      if (lastRow > rest) {
        try {
          sheet.deleteRows(rest + 1, lastRow - rest);
        } catch (e) {
          Logger.log('Error deleting rows: ' + e.message);
        }
      }
  
    } catch (error) {
      Logger.log('Error in fetchSessionSources: ' + error.message);
    }
  }
  
  /**
   * Processes the report data and adds the account ID to each row.
   * @param {Object} report - The report object returned from the API.
   * @param {string} account - The account ID.
   * @return {Array} The processed data rows.
   */
  function processReportData(report, account) {
    if (!report.rows) {
      Logger.log('No rows returned.');
      return [];
    }
  
    const dimensionHeaders = report.dimensionHeaders.map(dimensionHeader => dimensionHeader.name);
    const metricHeaders = report.metricHeaders.map(metricHeader => metricHeader.name);
    const headers = [...dimensionHeaders, ...metricHeaders];
  
    const rows = report.rows.map(row => {
      const dimensionValues = row.dimensionValues.map(dimensionValue => dimensionValue.value);
      const metricValues = row.metricValues.map(metricValue => metricValue.value);
      return [...dimensionValues, ...metricValues, account];
    });
  
    return rows;
  }
  