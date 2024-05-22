/**
 * Main function to process primary health clients and generate commissionable data.
 */
function processPrimaryHealthClients() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var mainSheet = spreadsheet.getSheetByName("Primary Commissionable Clients");
    var healthDataSheet = spreadsheet.getSheetByName("Health Raw Data");
    
    var allPBM = mainSheet.getRange('A2:A20').getValues();
    var healthData = healthDataSheet.getRange("A2").getDataRegion().getValues();
  
    var now = new Date();
    var timezone = Session.getScriptTimeZone();
    
    // Calculate start and end dates for the previous month
    var startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    var endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    var month = Utilities.formatDate(startDate, timezone, "MMMM");
    var year = Utilities.formatDate(startDate, timezone, "yyyy");
  
    var finalHSAData = [];
    var pbmList = getNonEmptyPBMs(allPBM);
    var pbmCount = pbmList.length - 1;
  
    // Define filters for health data
    var personTypes = ["Client - HSA", "Client - CO", "Pre Client"];
    var appStatuses = ["In-Force", "Pending Verification"];
    var healthStatuses = ["HSA", "Non HSA"];
    var healthPlanType = "HealthShare Plan";
  
    // Filter health data based on defined criteria
    var hsaRecords = filterHealthData(healthData, personTypes, healthStatuses, appStatuses);
    var healthPlanRecords = filterHealthData(healthData, personTypes, [healthPlanType], appStatuses);
  
    // Process data for each PBM
    for (var i = 0; i < pbmCount; i++) {
      var pbm = pbmList[i];
      var pbmHSARecords = filterRecordsByPBM(hsaRecords, pbm);
      var pbmHealthPlanRecords = filterRecordsByPBM(healthPlanRecords, pbm);
  
      finalHSAData.push([
        pbm,
        month,
        year,
        pbmHealthPlanRecords.length,
        pbmHSARecords.length,
        pbmHealthPlanRecords.length + pbmHSARecords.length
      ]);
    }
  
    // Process data for other AORs
    var otherAORHSARecords = filterRecordsExcludingPBMs(hsaRecords, pbmList);
    var otherAORHealthPlanRecords = filterRecordsExcludingPBMs(healthPlanRecords, pbmList);
  
    finalHSAData.push([
      pbmList[pbmCount],
      month,
      year,
      otherAORHealthPlanRecords.length,
      otherAORHSARecords.length,
      otherAORHealthPlanRecords.length + otherAORHSARecords.length
    ]);
  
    return finalHSAData;
  }
  
  /**
   * Filters non-empty PBM values from the given list.
   * @param {Array} pbmArray - The array of PBM values.
   * @return {Array} The filtered array of non-empty PBM values.
   */
  function getNonEmptyPBMs(pbmArray) {
    return pbmArray.filter(function (pbm) {
      return pbm[0] !== "";
    }).map(function (pbm) {
      return pbm[0];
    });
  }
  
  /**
   * Filters health data based on person type, health status, and application status.
   * @param {Array} healthData - The array of health data.
   * @param {Array} personTypes - The array of person types to include.
   * @param {Array} healthStatuses - The array of health statuses to include.
   * @param {Array} appStatuses - The array of application statuses to include.
   * @return {Array} The filtered health data.
   */
  function filterHealthData(healthData, personTypes, healthStatuses, appStatuses) {
    return healthData.filter(function (record) {
      return personTypes.includes(record[1]) &&
             healthStatuses.includes(record[5]) &&
             appStatuses.includes(record[6]);
    });
  }
  
  /**
   * Filters records by a specific PBM.
   * @param {Array} records - The array of records.
   * @param {string} pbm - The PBM value to filter by.
   * @return {Array} The filtered records.
   */
  function filterRecordsByPBM(records, pbm) {
    return records.filter(function (record) {
      return pbm === record[2];
    });
  }
  
  /**
   * Filters records excluding specific PBMs.
   * @param {Array} records - The array of records.
   * @param {Array} pbmList - The list of PBMs to exclude.
   * @return {Array} The filtered records.
   */
  function filterRecordsExcludingPBMs(records, pbmList) {
    return records.filter(function (record) {
      return !pbmList.includes(record[2]);
    });
  }  