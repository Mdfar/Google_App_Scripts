/**
 * Main function to process health data by carrier and update the spreadsheet.
 */
function processHealthDataByCarrier() {
    try {
      var now = new Date();
      var timezone = Session.getScriptTimeZone();
      var startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      var endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      var month = Utilities.formatDate(startDate, timezone, "MMMM");
      var year = Utilities.formatDate(startDate, timezone, "yyyy");
  
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var mainSheet = spreadsheet.getSheetByName("Health_Clients_Carrier");
      var lastRow = mainSheet.getLastRow();
  
      var pbmSheet = spreadsheet.getSheetByName("Primary Commissionable Clients");
      var allPBM = getNonEmptyPBMs(pbmSheet.getRange('A2:A20').getValues());
      var currentPBM = getNonEmptyPBMs(mainSheet.getRange('A1:A18').getValues());
  
      var data1 = mainSheet.getRange(22, 4, lastRow - 21, currentPBM.length + 1).getValues();
      var data2 = mainSheet.getRange(22, 7 + currentPBM.length, lastRow - 21, currentPBM.length + 4).getValues();
  
      var newPBMs = allPBM.filter(pbm => !currentPBM.includes(pbm));
      if (newPBMs.length > 0) {
        insertNewPBMs(allPBM, data1, data2, newPBMs);
        updateSheetWithNewPBMs(mainSheet, allPBM, data1, data2);
      }
  
      var dataSheet = spreadsheet.getSheetByName("Health Raw Data");
      var records = filterHealthRecords(dataSheet, ["Client - HSA", "Client - CO", "Pre Client"], ["In-Force", "Pending Verification"]);
  
      var carrierNames = getUniqueCarriers(dataSheet);
      var recordsHSA = records.filter(record => ["HSA", "Non HSA"].includes(record[5]));
      var recordsHealthPlan = records.filter(record => record[5] === "HealthShare Plan");
  
      var rowsHSA = [];
      var rowsHealth = [];
      var pbms = allPBM.slice(0, -1); // Remove the last PBM
  
      carrierNames.forEach(carrier => {
        var carrierCountHSA = [carrier, month, year];
        var carrierCountHealth = [carrier, month, year];
  
        var otherAORCountHSA = 0;
        var otherAORCountHealth = 0;
  
        var carrierHSAs = recordsHSA.filter(record => record[4] === carrier);
        var carrierHealthPlans = recordsHealthPlan.filter(record => record[4] === carrier);
  
        pbms.forEach(pbm => {
          var pbmHSAs = carrierHSAs.filter(record => record[2] === pbm);
          var pbmHealthPlans = carrierHealthPlans.filter(record => record[2] === pbm);
  
          otherAORCountHSA += pbmHSAs.length;
          otherAORCountHealth += pbmHealthPlans.length;
  
          carrierCountHSA.push(pbmHSAs.length);
          carrierCountHealth.push(pbmHealthPlans.length);
        });
  
        carrierCountHSA.push(carrierHSAs.length - otherAORCountHSA, carrierHSAs.length);
        carrierCountHealth.push(carrierHealthPlans.length - otherAORCountHealth, carrierHealthPlans.length);
  
        rowsHSA.push(carrierCountHSA);
        rowsHealth.push(carrierCountHealth);
      });
  
      mainSheet.getRange(lastRow + 1, 1, rowsHSA.length, rowsHSA[0].length).setValues(rowsHSA);
      mainSheet.getRange(lastRow + 1, allPBM.length + 7, rowsHealth.length, rowsHealth[0].length).setValues(rowsHealth);
  
    } catch (error) {
      Logger.log('Error in processHealthDataByCarrier: ' + error.message);
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
   * Inserts new PBMs into the data arrays at the appropriate positions.
   * @param {Array} allPBM - The array of all PBM values.
   * @param {Array} data1 - The first data array.
   * @param {Array} data2 - The second data array.
   * @param {Array} newPBMs - The array of new PBM values to insert.
   */
  function insertNewPBMs(allPBM, data1, data2, newPBMs) {
    newPBMs.forEach(pbm => {
      var index = allPBM.indexOf(pbm);
      data1.forEach(row => row.splice(index, 0, 0));
      data2.forEach(row => row.splice(index + 3, 0, 0));
    });
  }
  
  /**
   * Updates the spreadsheet with new PBM values and adjusted data arrays.
   * @param {Object} mainSheet - The main sheet object.
   * @param {Array} allPBM - The array of all PBM values.
   * @param {Array} data1 - The first data array.
   * @param {Array} data2 - The second data array.
   */
  function updateSheetWithNewPBMs(mainSheet, allPBM, data1, data2) {
    mainSheet.getRange(22, 4, data1.length, data1[0].length).setValues(data1);
    mainSheet.getRange(22, 5 + allPBM.length, data1.length, newPBMs.length).clearContent();
    mainSheet.getRange(22, 6 + data1[0].length, data2.length, data2[0].length).setValues(data2);
    mainSheet.getRange(1, 1, allPBM.length, 1).setValues(allPBM.map(pbm => [pbm]));
  }
  
  /**
   * Filters health records based on person type and application status.
   * @param {Object} dataSheet - The data sheet object.
   * @param {Array} personTypes - The array of person types to include.
   * @param {Array} appStatuses - The array of application statuses to include.
   * @return {Array} The filtered health records.
   */
  function filterHealthRecords(dataSheet, personTypes, appStatuses) {
    return dataSheet.getRange(2, 1, dataSheet.getLastRow(), 8).getValues().filter(record => 
      personTypes.includes(record[1]) && appStatuses.includes(record[6])
    );
  }
  
  /**
   * Retrieves unique carrier names from the data sheet.
   * @param {Object} dataSheet - The data sheet object.
   * @return {Array} The array of unique carrier names.
   */
  function getUniqueCarriers(dataSheet) {
    var carriers = dataSheet.getRange(2, 5, dataSheet.getLastRow(), 1).getValues().flat();
    return [...new Set(carriers)].filter(carrier => carrier !== "");
  }
  