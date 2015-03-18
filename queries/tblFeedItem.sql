CREATE TABLE tblFeedItem (
	fitFeedItemID			SERIAL PRIMARY KEY,
	fitFeedChannelID		INTEGER references tblFeedChannel(fedFeedChannelID),
	
	fitFeedItemTitle		TEXT	PRIMARY KEY,
	fitFeedItemLink			TEXT	PRIMARY KEY,
	fitFeedItemDescription	TEXT	PRIMARY KEY
);

