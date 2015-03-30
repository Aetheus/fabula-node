ALTER TABLE linkFeedChannelTag
ADD UNIQUE 
(linkTagID,linkFeedChannelID);


ALTER TABLE linkUserFeedItem
ADD UNIQUE 
(linkFeedItemID, linkUserID);


ALTER TABLE linkUserSystemRole
ADD UNIQUE
(linkUserID, linkSystemRoleID);
