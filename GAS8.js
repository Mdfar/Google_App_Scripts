/**
 * Main function to process MGA data by carrier and update the spreadsheet.
 */
function processMGADataByCarrier() {
    try {
      var now = new Date();
      var timezone = Session.getScriptTimeZone();
      var startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      var endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      var month = Utilities.formatDate(startDate, timezone, "MMMM");
      var year = Utilities.formatDate(startDate, timezone, "yyyy");
  
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var mainSheet = spreadsheet.getSheetByName("MGA_Clients_Carrier");
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
  
      var dataSheet = spreadsheet.getSheetByName("MGA Raw Data");
      var records = filterMGARecords(dataSheet, ["Medigap Client - Agent", "Medigap Client - Company", "Pre Client", "Medicare Advantage Client"], ["In-Force", "Pending Verification", "Reduced-Commissions"]);
  
      var carrierNames = getUniqueCarriers(dataSheet);
      var recordsMAPD = records.filter(record => ["MAPD", "MSA", "Med Advantage"].includes(record[5]));
      var recordsMedSupp = records.filter(record => ["Med Supp new to Medicare", "Med Supp Outside Initial Open Enrollment", "Med Supp unknown EP"].includes(record[5]));
  
      var rowsMAPD = [];
      var rowsMedSupp = [];
      var pbms = allPBM.slice(0, -1); // Remove the last PBM
  
      carrierNames.forEach(carrier => {
        var carrierCountMAPD = [carrier, month, year];
        var carrierCountMedSupp = [carrier, month, year];
  
        var otherAORCountMAPD = 0;
        var otherAORCountMedSupp = 0;
  
        var carrierMAPD = recordsMAPD.filter(record => record[4] === carrier);
        var carrierMedSupp = recordsMedSupp.filter(record => record[4] === carrier);
  
        pbms.forEach(pbm => {
          var pbmMAPD = carrierMAPD.filter(record => record[2] === pbm);
          var pbmMedSupp = carrierMedSupp.filter(record => record[2] === pbm);
  
          otherAORCountMAPD += pbmMAPD.length;
          otherAORCountMedSupp += pbmMedSupp.length;
  
          carrierCountMAPD.push(pbmMAPD.length);
          carrierCountMedSupp.push(pbmMedSupp.length);
        });
  
        carrierCountMAPD.push(carrierMAPD.length - otherAORCountMAPD, carrierMAPD.length);
        carrierCountMedSupp.push(carrierMedSupp.length - otherAORCountMedSupp, carrierMedSupp.length);
  
        rowsMAPD.push(carrierCountMAPD);
        rowsMedSupp.push(carrierCountMedSupp);
      });
  
      mainSheet.getRange(lastRow + 1, 1, rowsMAPD.length, rowsMAPD[0].length).setValues(rowsMAPD);
      mainSheet.getRange(lastRow + 1, allPBM.length + 7, rowsMedSupp.length, rowsMedSupp[0].length).setValues(rowsMedSupp);
  
    } catch (error) {
      Logger.log('Error in processMGADataByCarrier: ' + error.message);
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
   * Filters MGA records based on person type and application status.
   * @param {Object} dataSheet - The data sheet object.
   * @param {Array} personTypes - The array of person types to include.
   * @param {Array} appStatuses - The array of application statuses to include.
   * @return {Array} The filtered MGA records.
   */
  function filterMGARecords(dataSheet, personTypes, appStatuses) {
    return dataSheet.getRange(2, 1, dataSheet.getLastRow(), 8).getValues().filter(record => 
      personTypes.includes(record[1]) && appStatuses.includes(record[7])
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
  