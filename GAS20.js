/**
 * Main function to retrieve and process campaign statistics from Bing Ads API.
 */
function fetchCampaignStats() {
    try {
      const userProperties = PropertiesService.getUserProperties();
      const accessToken = userProperties.getProperties().access_token;
  
      const customerAccountId = '68297';
      const customerId = '74402';
      const developerToken = '11993RFWRV627865';
  
      const soapEnvelope = `
        <s:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
          <s:Header xmlns="https://bingads.microsoft.com/CampaignManagement/v13">
            <Action mustUnderstand="1">GetCampaignsByAccountId</Action>
            <AuthenticationToken i:nil="false">${accessToken}</AuthenticationToken>
            <CustomerAccountId i:nil="false">${customerAccountId}</CustomerAccountId>
            <CustomerId i:nil="false">${customerId}</CustomerId>
            <DeveloperToken i:nil="false">${developerToken}</DeveloperToken>
          </s:Header>
          <s:Body>
            <GetCampaignsByAccountIdRequest xmlns="https://bingads.microsoft.com/CampaignManagement/v13">
              <AccountId>${customerAccountId}</AccountId>
              <CampaignType>Search</CampaignType>
            </GetCampaignsByAccountIdRequest>
          </s:Body>
        </s:Envelope>
      `;
  
      const url = 'https://campaign.api.bingads.microsoft.com/Api/Advertiser/CampaignManagement/V13/CampaignManagementService.svc?singleWsdl';
  
      const options = {
        method: 'post',
        contentType: 'text/xml;charset=utf-8',
        payload: soapEnvelope,
        headers: {
          SOAPAction: 'GetCampaignsByAccountId'
        }
      };
  
      const xmlResponse = UrlFetchApp.fetch(url, options);
      const document = XmlService.parse(xmlResponse.getContentText());
      const root = document.getRootElement();
      const namespace = XmlService.getNamespace('https://bingads.microsoft.com/CampaignManagement/v13');
  
      const campaigns = root.getChild('Body', XmlService.getNamespace('http://schemas.xmlsoap.org/soap/envelope/'))
                            .getChild('GetCampaignsByAccountIdResponse', namespace)
                            .getChild('Campaigns', namespace)
                            .getChildren('Campaign', namespace);
  
      const campaignStats = campaigns.map(campaign => {
        const id = campaign.getChildText('Id', namespace);
        const status = campaign.getChildText('Status', namespace);
        return [id, status];
      });
  
      return campaignStats;
    } catch (error) {
      Logger.log('Error in fetchCampaignStats: ' + error.message);
      return [];
    }
  }
  