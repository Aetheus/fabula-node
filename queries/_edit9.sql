ALTER TABLE tblfeeditem DROP CONSTRAINT 
feeditemidentity;


ALTER TABLE tblfeeditem 
ADD CONSTRAINT feeditemidentity UNIQUE 
(fitFeedChannelID,fitFeedItemTitle,
	fitFeedItemLink,fitFeedItemDescription, fitFeedItemImageLink);