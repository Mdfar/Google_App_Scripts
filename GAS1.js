// Main function to retrieve and consolidate data from a specific Google Spreadsheet
function consolidateData() {
    try {
      var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var sourceSpreadsheet = getSourceSpreadsheet();
      
      // Get header data from a specific sheet and modify it to include 'Month' column
      var header = sourceSpreadsheet.getSheetByName("February 2024 Consolidated").getRange(1, 1, 1, 31).getValues();
      header[0].splice(26, 0, 'Month');
  
      var targetSheet = activeSpreadsheet.getSheetByName('All Data Merged');
      var range = targetSheet.getDataRange();
      range.clearContent();
  
      var timezone = Session.getScriptTimeZone();
      var currentYear = Utilities.formatDate(new Date(), timezone, "yyyy");
  
      // Get all data for the current year and previous months
      var allData = getAllDataForYear(sourceSpreadsheet, currentYear);
      
      // Set header and data to the target sheet
      targetSheet.getRange(1, 1, 1, header[0].length).setValues(header);
      targetSheet.getRange(2, 1, allData.length, allData[0].length).setValues(allData);
    } catch (error) {
      Logger.log('Error in consolidateData: ' + error.message);
    }
  }
  
  // Function to retrieve all data for a given year from the source spreadsheet
  function getAllDataForYear(sourceSpreadsheet, year) {
    var timezone = Session.getScriptTimeZone();
    var mergedData = [];
  
    // Loop through the past 36 months to gather data
    for (var i = 0; i < 36; i++) {
      var yearOffset = year - Math.floor(i / 12);
      var monthIndex = i % 12;
      var firstDayOfMonth = new Date(yearOffset, monthIndex, 1);
      var sheetName = Utilities.formatDate(firstDayOfMonth, timezone, "MMMM yyyy") + " Consolidated";
  
      try {
        var monthSheet = sourceSpreadsheet.getSheetByName(sheetName);
        var lastRow = monthSheet.getLastRow();
        var values = monthSheet.getRange(2, 1, lastRow - 1, 31).getValues();
        mergedData = mergedData.concat(values);
      } catch (e) {
        Logger.log('Error processing sheet: ' + sheetName + ' - ' + e.message);
      }
    }
  
    // Add year and month to the data
    mergedData.forEach(row => {
      row[25] = Utilities.formatDate(getEndOfWeek(row[10]), timezone, "yyyy");
      row.splice(26, 0, Utilities.formatDate(getEndOfWeek(row[10]), timezone, "MMMM"));
    });
  
    return mergedData;
  }
  
  // Function to get the end date of the week for a given date
  function getEndOfWeek(date) {
    var dateObj = new Date(date);
    var endOfWeek = new Date(dateObj);
    var daysUntilFriday = 5 - dateObj.getDay();
  
    if (dateObj.getDay() === 6) {
      endOfWeek.setDate(dateObj.getDate() + 6);
    } else {
      endOfWeek.setDate(dateObj.getDate() + daysUntilFriday);
    }
  
    return endOfWeek;
  }
  
  // Function to retrieve the source spreadsheet using its ID from script properties
  function getSourceSpreadsheet() {
    var properties = PropertiesService.getScriptProperties();
    var spreadsheetId = properties.getProperty('SPREADSHEET_ID');
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID not set in script properties');
    }
    return SpreadsheetApp.openById(spreadsheetId);
  }
  
  // Utility function to set the source spreadsheet ID (run once to set and then delete)
  function setSourceSpreadsheetId() {
    var properties = PropertiesService.getScriptProperties();
    properties.setProperty('SPREADSHEET_ID', '1vdA7oF_5HcSvtZwKRdkJJrS61mpY8i3TgvaMKvDrydc');
  }  