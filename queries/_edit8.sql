ALTER TABLE tblfeeditem DROP CONSTRAINT 
tblfeeditem_fitfeedchannelid_fitfeeditemtitle_fitfeeditemli_key;


ALTER TABLE tblfeeditem 
ADD CONSTRAINT feeditemidentity UNIQUE 
(fitFeedChannelID,fitFeedItemTitle,
	fitFeedItemLink,fitFeedItemDescription, fitFeedItemImageLink, fittimestamp);