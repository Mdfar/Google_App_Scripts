/**
 * Main function to fetch data from the WorldFengur API and log the response.
 */
function fetchWorldFengurData() {
    try {
      var headers = {
        'Content-Type': 'application/json',
      };
      var options = {
        'method': 'GET',
        'headers': headers,
        'muteHttpExceptions': true
      };
      var url = 'https://worldfengurapi.pythonanywhere.com/horse?feifid=IS2015287660';
  
      var response = UrlFetchApp.fetch(url, options);
  
      if (response.getResponseCode() === 200) {
        var json = response.getContentText();
        var data = JSON.parse(json);
        Logger.log(data);
      } else {
        Logger.log('Error fetching data: ' + response.getResponseCode());
      }
    } catch (error) {
      Logger.log('Error in fetchWorldFengurData: ' + error.message);
    }
  }  