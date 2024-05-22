/**
 * Main function to process data and create a colored chart.
 */
function createColoredChart() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const chartSheet = ss.getSheetByName("Chart");
      const lastRow = chartSheet.getLastRow();
      const lastCol = chartSheet.getLastColumn();
  
      // Clear old chart columns
      try {
        chartSheet.deleteColumns(6, lastCol - 6);
      } catch (e) {
        // Ignore errors from deleteColumns
      }
  
      // Get and filter data
      const data = chartSheet.getRange(2, 1, lastRow - 1, 3).getValues().filter(item => item.indexOf('') === -1);
  
      const highs = [];
      const lows = [];
      const closes = [];
      data.forEach(row => {
        highs.push(row[0]);
        lows.push(row[1]);
        closes.push(row[2]);
      });
  
      const maxPoint = Math.ceil(Math.max(...highs)) + 3;
      const minPoint = Math.floor(Math.min(...lows)) - 3;
      const xAxis = [];
      for (let i = maxPoint; i >= minPoint; i--) {
        xAxis.push([i]);
      }
  
      // Clear old chart content and set up the X-axis
      try {
        chartSheet.getRange(1, 5, lastRow, lastCol - 5).clearContent().setBackground("white");
      } catch (e) {
        // Ignore errors from clearContent
      }
      chartSheet.getRange(1, 5, xAxis.length, 1).setFontSize(9).setFontFamily("Georgia").setValues(xAxis);
  
      // Create the chart
      for (let i = 0; i < (data.length * 2); i += 2) {
        const j = i / 2;
        const high = Math.ceil(data[j][0]);
        const low = Math.floor(data[j][1]);
        const close = Math.ceil(data[j][2]);
  
        chartSheet.getRange(maxPoint - high, i + 6, 1, 1)
          .setValue(String.fromCharCode(j + 65))
          .setHorizontalAlignment("center")
          .setVerticalAlignment("bottom")
          .setFontSize(9)
          .setFontFamily("Georgia")
          .setFontWeight("bold");
  
        chartSheet.getRange(1, i + 6, maxPoint - minPoint + 1, 2)
          .setBackground('white')
          .setBorder(true, true, true, true, true, true, 'white', SpreadsheetApp.BorderStyle.SOLID);
  
        chartSheet.setColumnWidth(i + 6, 15)
          .setRowHeight(maxPoint - high + 1, 20)
          .getRange(maxPoint - high + 1, i + 6, 1, 1)
          .setBackground('#2599f7');
  
        chartSheet.setRowHeight(maxPoint - high + 2, 20)
          .getRange(maxPoint - high + 2, i + 6, high - low - 1, 1)
          .setBackground("#6bf037")
          .setBorder(true, true, true, true, true, true, "#6bf037", SpreadsheetApp.BorderStyle.SOLID_THICK);
  
        chartSheet.setRowHeight(maxPoint - low + 1, 20)
          .getRange(maxPoint - low + 1, i + 6, 1, 1)
          .setBackground("#f75252");
  
        chartSheet.setColumnWidth(i + 7, 25)
          .getRange(maxPoint - close + 1, i + 7, 1, 1)
          .setBackground("#a3a3a3");
      }
  
      // Build and set final array of metrics
      const finalArray = buildMetrics(maxPoint - 3, minPoint + 3, data);
      chartSheet.getRange(4, chartSheet.getLastColumn() + 3, finalArray.length, finalArray[0].length)
        .setValues(finalArray)
        .setFontSize(9)
        .setFontFamily('Georgia')
        .setFontWeight('bold')
        .setVerticalAlignment('middle')
        .setHorizontalAlignment('center');
  
    } catch (error) {
      Logger.log('Error in createColoredChart: ' + error.message);
    }
  }
  
  /**
   * Builds an array of metrics for the chart.
   * @param {number} maxPoint - The maximum point on the chart.
   * @param {number} minPoint - The minimum point on the chart.
   * @param {Array} data - The data array.
   * @return {Array} The built array of metrics.
   */
  function buildMetrics(maxPoint, minPoint, data) {
    // Implement the logic to build and return the final metrics array
    // Placeholder implementation as the original code does not provide the details of metricbuild
    return [];
  }  