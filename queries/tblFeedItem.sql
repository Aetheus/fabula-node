CREATE TABLE tblFeedItem (
	fitFeedItemID			SERIAL PRIMARY KEY,
	fitFeedChannelID		INTEGER references tblFeedChannel(fedFeedChannelID) ON DELETE CASCADE ON UPDATE CASCADE,
	
	fitFeedItemTitle		TEXT,
	fitFeedItemLink			TEXT,
	fitFeedItemDescription	TEXT
);

