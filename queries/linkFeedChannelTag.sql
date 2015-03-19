CREATE TABLE linkFeedChannelTag (
	linkTagID			TEXT	references tblTag(tagTagID) ON DELETE CASCADE ON UPDATE CASCADE,
	linkFeedChannelID	SERIAL	references tblFeedChannel(fedFeedChannelID) ON DELETE CASCADE ON UPDATE CASCADE
);
