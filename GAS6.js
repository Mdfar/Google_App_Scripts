/**
 * Main function to process MGA data and generate a report of lost clients.
 */
function processMGALostClients() {
    try {
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var mainSheet = spreadsheet.getSheetByName("Primary Commissionable Clients");
      var mgaDataSheet = spreadsheet.getSheetByName("MGA Raw Data");
  
      var allPBM = mainSheet.getRange('A2:A20').getValues();
      var mgaData = mgaDataSheet.getRange('A2').getDataRegion().getValues();
      var timezone = Session.getScriptTimeZone();
  
      // Filter out empty PBM values
      var pbmList = getNonEmptyPBMs(allPBM);
  
      var currentDate = new Date();
      var clientStatuses = ["Rewrite - Former Advisor", "Rewrite"];
      var validRecords = mgaData.filter(record => !clientStatuses.includes(record[3]));
  
      var lostClientsReport = [];
      var startYear = 2023;
  
      // Process data for each year and month
      for (var year = startYear; year <= currentDate.getFullYear(); year++) {
        var yearlyRecords = filterRecordsByYear(validRecords, year, timezone);
  
        for (var month = 1; month <= 12; month++) {
          var monthlyRecords = filterRecordsByMonth(yearlyRecords, year, month, timezone);
          var totalRecords = monthlyRecords.length;
          var otherAORCount = 0;
  
          pbmList.forEach(pbm => {
            var termedRecords = monthlyRecords.filter(record => record[2] === pbm);
  
            var monthName = Utilities.formatDate(new Date(year, month - 1, 1), timezone, "MMMM");
            otherAORCount += termedRecords.length;
  
            if (pbm === "Other AOR") {
              lostClientsReport.push([pbm, monthName, year, totalRecords - otherAORCount]);
            } else {
              lostClientsReport.push([pbm, monthName, year, termedRecords.length]);
            }
          });
        }
      }
  
      return lostClientsReport;
  
    } catch (error) {
      Logger.log('Error in processMGALostClients: ' + error.message);
    }
  }
  
  /**
   * Filters non-empty PBM values from the given list.
   * @param {Array} pbmArray - The array of PBM values.
   * @return {Array} The filtered array of non-empty PBM values.
   */
  function getNonEmptyPBMs(pbmArray) {
    return pbmArray.filter(pbm => pbm[0] !== "").map(pbm => pbm[0]);
  }
  
  /**
   * Filters records for a specific year.
   * @param {Array} records - The array of records.
   * @param {number} year - The year to filter by.
   * @param {string} timezone - The script's timezone.
   * @return {Array} The filtered records for the specified year.
   */
  function filterRecordsByYear(records, year, timezone) {
    return records.filter(record => {
      var recordYear = Utilities.formatDate(new Date(record[8]), timezone, "yyyy");
      return recordYear == year;
    });
  }
  
  /**
   * Filters records for a specific month within a year.
   * @param {Array} records - The array of records.
   * @param {number} year - The year to filter by.
   * @param {number} month - The month to filter by (1-12).
   * @param {string} timezone - The script's timezone.
   * @return {Array} The filtered records for the specified month.
   */
  function filterRecordsByMonth(records, year, month, timezone) {
    return records.filter(record => {
      var recordDate = new Date(record[8]);
      var recordMonth = Utilities.formatDate(recordDate, timezone, "M");
      var recordYear = Utilities.formatDate(recordDate, timezone, "yyyy");
      return recordYear == year && recordMonth == month;
    });
  }  