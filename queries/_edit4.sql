ALTER TABLE tblFeedChannel 
ADD COLUMN 
fedFeedChannelIsCustom	BOOLEAN;

ALTER TABLE tblFeedChannel 
ADD COLUMN 
fedFeedChannelImageLinkSelector TEXT;

ALTER TABLE tblFeedItem 
ADD COLUMN
fitFeedItemImageLink		TEXT;