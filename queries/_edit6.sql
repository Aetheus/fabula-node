/*place a unique restriction on every column except FeedChannelID, so no duplicate channels from the same user can be insreted*/
/*error here. check edit 7 for details*/
ALTER TABLE tblFeedChannel
ADD CONSTRAINT feedIdentity UNIQUE 
(fedFeedChannelID,fedUserID,fedFeedChannelName,fedFeedChannelDesc,fedFeedChannelURL,fedFeedChannelTitleSelector,fedFeedChannelLinkSelector,fedFeedChannelDescriptionSelector,fedFeedChannelAncestorSelector ,fedFeedChannelIsActive);


