CREATE TABLE linkFeedChannelTag (
	linkTagID			TEXT	references tblTag(tagTagID),
	linkFeedChannelID	SERIAL	references tblFeedChannel(fedFeedChannelID)
);
