
CREATE TABLE linkUserFeedItem(
	linkFeedItemID	INTEGER references tblFeedItem(fitFeedItemID) ON DELETE CASCADE ON UPDATE CASCADE,
	linkUserID 		TEXT references tblUser(usrUserID) ON DELETE CASCADE ON UPDATE CASCADE,
	linkIsRead		BOOLEAN
)


/* linkUserFeedItem is a slightly special junction/link table, since it includes a data column (isRead) */