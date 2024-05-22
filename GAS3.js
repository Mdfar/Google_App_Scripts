/**
 * Main function to fetch MGA data from API and update the spreadsheet
 */
function fetchAndStoreMGAData() {
    try {
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var dataSheet = spreadsheet.getSheetByName("MGA Raw Data");
      var timezone = Session.getScriptTimeZone();
      var lastRow = dataSheet.getLastRow();
  
      // Define headers and options for the API request
      var headers = {
        'Content-Type': 'application/json',
        'X-Keap-API-Key': getKeapApiKey()
      };
      var options = {
        'method': 'GET',
        'headers': headers,
        'muteHttpExceptions': true
      };
  
      var totalEntries = 1000;
      var allEntries = [];
  
      // Fetch data in chunks of 1000 entries
      for (var offset = 0; offset < totalEntries; offset += 1000) {
        var url = buildApiUrl(offset);
        var response = UrlFetchApp.fetch(url, options);
        var data = JSON.parse(response.getContentText());
  
        totalEntries = data.count;
        var contacts = data.contacts;
  
        // Process each contact entry
        contacts.forEach(contact => {
          var entry = processContactEntry(contact, timezone);
          if (entry) {
            allEntries.push(entry);
          }
        });
  
        Utilities.sleep(1000); // Prevent API rate limiting
      }
  
      // Clear old data and update the sheet with new entries
      dataSheet.getRange(2, 1, lastRow - 1, 9).clearContent();
      dataSheet.getRange(2, 1, allEntries.length, allEntries[0].length).setValues(allEntries);
  
    } catch (error) {
      Logger.log('Error in fetchAndStoreMGAData: ' + error.message);
    }
  }
  
  /**
   * Builds the API URL with the specified offset
   * @param {number} offset - The offset for pagination
   * @return {string} The constructed API URL
   */
  function buildApiUrl(offset) {
    var baseUrl = 'https://api.infusionsoft.com/crm/rest/v1/contacts/?optional_properties=custom_fields,contact_type&order=id&limit=1000&offset=';
    return baseUrl + offset;
  }
  
  /**
   * Processes a single contact entry and returns the formatted data
   * @param {object} contact - The contact object from the API
   * @param {string} timezone - The script's timezone
   * @return {array} The processed contact data or null if invalid
   */
  function processContactEntry(contact, timezone) {
    var entry = [];
    var contactID = contact["id"];
    var contactType = contact["contact_type"];
    var customFields = contact["custom_fields"];
  
    entry.push(contactID, contactType);
  
    customFields.forEach(field => {
      var fieldId = field["id"];
      if ([6, 10, 12, 14, 60, 574, 674].includes(fieldId)) {
        entry.push(field["content"]);
      }
    });
  
    if (!entry[2]) {
      return null;
    } else {
      var dateField = new Date(entry[8]);
      entry[8] = Utilities.formatDate(dateField, timezone, "yyyy-MM-dd");
      return entry;
    }
  }
  
  /**
   * Retrieves the Keap API key from script properties
   * @return {string} The Keap API key
   */
  function getKeapApiKey() {
    var properties = PropertiesService.getScriptProperties();
    var apiKey = properties.getProperty('KEAP_API_KEY');
    if (!apiKey) {
      throw new Error('Keap API key not set in script properties');
    }
    return apiKey;
  }
  
  /**
   * Utility function to set the Keap API key (run once to set and then delete)
   */
  function setKeapApiKey() {
    var properties = PropertiesService.getScriptProperties();
    properties.setProperty('KEAP_API_KEY', 'YOUR_KEAP_API_KEY_HERE');
  }  