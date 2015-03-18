
CREATE TABLE linkUserFeedItem(){
	linkFeedItemID	INTEGER references tblFeedItem(fitFeedItemID),
	linkUserID 		TEXT references tblUser(usrUserID),
	linkIsRead		BOOLEAN
}


/* linkUserFeedItem is a slightly special junction/link table, since it includes a data column (isRead) */