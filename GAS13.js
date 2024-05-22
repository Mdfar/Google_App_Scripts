/**
 * Main function to retrieve and process totals data from multiple Google Analytics accounts.
 */
function fetchAndProcessTotals() {
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName('OrganicDateStat');
      const lastRow = sheet.getLastRow();
      const accounts = ['249626375', '323071907', '293866968', '260385509', '296314637'];
      const dimensions = ['sessionDefaultChannelGrouping'];
      const metrics = ['activeUsers', 'sessions', 'screenPageViews', 'averageSessionDuration'];
  
      const timeframes = [
        { startDate: calculateDateOffset(0, 0, 0, -1), endDate: calculateDateOffset(0, 0, 0, -1) },
        { startDate: calculateDateOffset(-1, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-1, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-2, 0, 0, -1), endDate: calculateDateOffset(-2, 0, 0, -1) },
        { startDate: calculateDateOffset(0, 0, 0, 1), endDate: calculateDateOffset(0, 0, 0, -1) },
        { startDate: calculateDateOffset(-7, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-14, 0, 0, -1), endDate: calculateDateOffset(-8, 0, 0, -1) },
        { startDate: calculateDateOffset(-14, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-28, 0, 0, -1), endDate: calculateDateOffset(-15, 0, 0, -1) },
        { startDate: calculateDateOffset(-30, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-60, 0, 0, -1), endDate: calculateDateOffset(-31, 0, 0, -1) },
        { startDate: calculateDateOffset(0, -1, 0, 1), endDate: calculateDateOffset(0, 0, 0, 0) },
        { startDate: calculateDateOffset(0, -2, 0, 1), endDate: calculateDateOffset(0, -1, 0, 0) },
        { startDate: calculateDateOffset(-60, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-120, 0, 0, -1), endDate: calculateDateOffset(-61, 0, 0, -1) },
        { startDate: calculateDateOffset(-90, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-180, 0, 0, -1), endDate: calculateDateOffset(-91, 0, 0, -1) },
        { startDate: calculateDateOffset(-180, 0, 0, -1), endDate: calculateDateOffset(-1, 0, 0, -1) },
        { startDate: calculateDateOffset(-360, 0, 0, -1), endDate: calculateDateOffset(-181, 0, 0, -1) },
        { startDate: calculateDateOffset(0, -12, 0, 1), endDate: calculateDateOffset(0, 0, 0, -1) },
        { startDate: calculateDateOffset(0, -24, 0, 1), endDate: calculateDateOffset(0, -12, 0, 0) },
      ];
  
      const timeframeLabels = [
        "TODAY", "PREVTODAY", "YESTERDAY", "PREVYESTERDAY", "THIS_MONTH", "LAST_7_DAYS", "PREVLAST_7_DAYS", 
        "LAST_14_DAYS", "PREVLAST_14_DAYS", "LAST_30_DAYS", "PREVLAST_30_DAYS", "LAST_MONTH", "PREVLAST_MONTH", 
        "LAST_60_DAYS", "PREVLAST_60_DAYS", "LAST_90_DAYS", "PREVLAST_90_DAYS", "LAST_180_DAYS", "PREVLAST_180_DAYS", 
        "THIS_12_MONTH", "PREVTHIS_12_MONTH"
      ];
  
      let rest = 1;
  
      accounts.forEach((propertyId) => {
        const limit = 2; // Set your desired page size
  
        timeframes.forEach((timeframe, index) => {
          const data = [];
          const request = AnalyticsData.newRunReportRequest();
  
          request.dimensions = dimensions.map(dimensionName => {
            const dimension = AnalyticsData.newDimension();
            dimension.name = dimensionName;
            return dimension;
          });
  
          request.metrics = metrics.map(metricName => {
            const metric = AnalyticsData.newMetric();
            metric.name = metricName;
            return metric;
          });
  
          const dimensionFilter = {
            filter: {
              fieldName: "sessionDefaultChannelGrouping",
              inListFilter: {
                values: ["Organic Search", "Referral"]
              }
            }
          };
          request.dimensionFilter = dimensionFilter;
  
          request.dateRanges = [timeframe];
          request.limit = limit;
  
          const report = AnalyticsData.Properties.runReport(request, 'properties/' + propertyId);
  
          const processedData = processReportData(report, propertyId, timeframeLabels[index]);
          if (processedData.length > 0) {
            sheet.getRange(rest + 1, 1, processedData.length, processedData[0].length).setValues(processedData);
          }
          rest += processedData.length;
        });
      });
  
      if (lastRow > rest) {
        try {
          sheet.deleteRows(rest + 1, lastRow - rest);
        } catch (e) {
          Logger.log('Error deleting rows: ' + e.message);
        }
      }
  
    } catch (error) {
      Logger.log('Error in fetchAndProcessTotals: ' + error.message);
    }
  }
  
  /**
   * Processes the report data and adds the account ID and timeframe to each row.
   * @param {Object} report - The report object returned from the API.
   * @param {string} propertyId - The account ID.
   * @param {string} timeframe - The timeframe label.
   * @return {Array} The processed data rows.
   */
  function processReportData(report, propertyId, timeframe) {
    if (!report.rows) {
      Logger.log('No rows returned.');
      return [];
    }
  
    const rows = report.rows.map(row => {
      const dimensionValues = row.dimensionValues.map(dimensionValue => dimensionValue.value);
      const metricValues = row.metricValues.map(metricValue => metricValue.value);
      return [...dimensionValues, ...metricValues, propertyId, timeframe];
    });
  
    return rows;
  }
  
  /**
   * Calculates the date with the specified offset.
   * @param {number} dayOffset - The day offset.
   * @param {number} monthOffset - The month offset.
   * @param {number} yearOffset - The year offset.
   * @param {number} dateFlag - The date flag to determine the end date.
   * @return {string} The calculated date in 'yyyy-MM-dd' format.
   */
  function calculateDateOffset(dayOffset, monthOffset, yearOffset, dateFlag) {
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
  