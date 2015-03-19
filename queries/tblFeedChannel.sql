CREATE TABLE tblFeedChannel (
	fedFeedChannelID	SERIAL PRIMARY KEY,
	fedUserID			TEXT references tblUser(usrUserID) ON DELETE CASCADE ON UPDATE CASCADE,

	fedFeedChannelName	TEXT NOT NULL,
	fedFeedChannelDesc	TEXT,

	fedFeedChannelURL			TEXT NOT NULL,
	fedFeedChannelTitleSelector	TEXT,
	fedFeedChannelLinkSelector	TEXT,
	fedFeedChannelDescriptionSelector TEXT,
	fedFeedChannelAncestorSelector TEXT,

	fedFeedChannelIsActive	BOOLEAN NOT NULL
);
