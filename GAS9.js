/**
 * Main function to process and find unworked leads from the previous week.
 */
function processUnworkedLeads() {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var date = new Date();
      date = new Date(date.getTime() - 24 * 60 * 60 * 1000 * 7);
      var startDay = date.getDay() + 1;
      var saturday = startDay !== 7 ? new Date(date.getTime() - 24 * 60 * 60 * 1000 * startDay) : date;
      var friday = new Date(saturday.getTime() + 24 * 60 * 60 * 1000 * 6);
      
      saturday.setHours(0, 0, 0, 0);
      friday.setHours(0, 0, 0, 0);
      var saturdayTime = saturday.getTime();
      var fridayTime = friday.getTime();
      
      var owners = [70410, 336308, 497173, 512407, 512559, 512561];
      var ownerNames = ["Leslie Jablonski", "Mike Montes", "Misty Berryman", "Lou Spatafore", "Whitney Kline", "Christine Corsini"];
      var personTypes = ["420 Prospect", "HSA Prospect", "Term Life Prospect", "CO Prospect", "Faith Based Prospect", "HSA Short Term Prospect", "CO Short Term Prospect"];
      var agentActions = ["Left Message 1", "Bad Phone #", "Agent Working With", "Talked To - Not Interested", "Other Attempted Contact (no message left)", "Sold", "Not Sold", "Client Connection", "Left Message 2+"];
      
      var sheetTime = new Date(fridayTime + 24 * 60 * 60 * 1000);
      var timezone = ss.getSpreadsheetTimeZone();
      var sheetName = Utilities.formatDate(sheetTime, timezone, "M/dd/yyyy");
      var mainSheet = ss.insertSheet(0);
      mainSheet.setName(sheetName);
      
      var arrayData = [];
      var header = [["Name", "Date created", "State", "Owner", "New Owner", "Worked by PBM or New PBM, yes/no", "Date worked by the PBM", "Agent Contact Status - Action", "Checked date/initials", "Person Type"]];
      
      var headers = {
        'Content-Type': 'application/json',
        'X-Keap-API-Key': getKeapApiKey()
      };
      var options = {
        'method': 'GET',
        'headers': headers,
        'muteHttpExceptions': true
      };
      var url = 'https://api.infusionsoft.com/crm/rest/v1/contacts/?optional_properties=custom_fields,contact_type&order=date_created&order_direction=descending&limit=1000&offset=0';
      var response = UrlFetchApp.fetch(url, options);
      var data = JSON.parse(response.getContentText());
      var infos = data.contacts;
      
      infos.forEach(info => processContactInfo(info, owners, ownerNames, personTypes, agentActions, saturdayTime, fridayTime, arrayData, options));
      
      var found = [];
      var formula = [];
      
      arrayData.forEach(data => {
        var first = data[11];
        if (!first.includes('0 - CB Advisor Actions') && !first.includes('0 - Agents')) {
          found.push(data.slice(2, 10));
          var link = `=HYPERLINK("https://m243.infusionsoft.com/Contact/manageContact.jsp?view=edit&ID=${data[0]}","${data[1]}")`;
          formula.push([link]);
        }
      });
      
      mainSheet.getRange(1, 1, 1, header[0].length).setValues(header);
      mainSheet.getRange(2, 1, formula.length, 1).setValues(formula);
      mainSheet.getRange(2, 2, found.length, found[0].length).setValues(found);
      
      var sourceSheet = ss.getSheetByName("3/10/23");
      var sourceRange = sourceSheet.getRange(1, 1, 500, 11);
      sourceRange.copyFormatToRange(mainSheet, 1, 11, 1, 500);
      
    } catch (error) {
      Logger.log('Error in processUnworkedLeads: ' + error.message);
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
   * Processes individual contact information and appends relevant data to the arrayData.
   * @param {Object} items - The contact item.
   * @param {Array} owners - The array of owner IDs.
   * @param {Array} ownerNames - The array of owner names.
   * @param {Array} personTypes - The array of person types to filter by.
   * @param {Array} agentActions - The array of agent actions to filter by.
   * @param {number} satTime - The start time of the week.
   * @param {number} friTime - The end time of the week.
   * @param {Array} arrayData - The array to store processed data.
   * @param {Object} options - The options for the UrlFetchApp request.
   */
  function processContactInfo(items, owners, ownerNames, personTypes, agentActions, satTime, friTime, arrayData, options) {
    var allItem = [];
    var dateCreated = new Date(items["date_created"].substring(0, 10));
    dateCreated.setHours(0, 0, 0, 0);
    var dateCreatedTime = dateCreated.getTime();
    var ownerId = items["owner_id"];
    var owner = ownerNames[owners.indexOf(ownerId)];
    var clientId = items.id;
    var states = items.addresses.map(address => address.region);
    var clientName = items["given_name"] + " " + items["family_name"];
    var person = items["contact_type"];
    
    if (owners.includes(ownerId) && personTypes.includes(person) && dateCreatedTime >= satTime && dateCreatedTime <= friTime) {
      items["custom_fields"].forEach(brand => {
        if (brand.id === 282 && brand.content === "HSA for America") {
          items["custom_fields"].forEach(action => {
            if (action.id === 833 && !agentActions.includes(action.content)) {
              allItem.push(clientId, clientName, dateCreated.toISOString().substring(0, 10), states[0], owner, "", "", "", action.content, "", person);
              try {
                var url = `https://api.infusionsoft.com/crm/rest/v1/contacts/${clientId}/tags`;
                var response = UrlFetchApp.fetch(url, options);
                var tagData = JSON.parse(response.getContentText());
                var categories = tagData.tags.map(tag => tag.category).join(",");
                allItem.push(categories);
                Utilities.sleep(1000);
              } catch (err) {
                allItem.push("");
              }
            }
          });
        }
      });
    }
    
    if (allItem.length > 0) {
      arrayData.push(allItem);
    }
  }  