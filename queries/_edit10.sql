/*Drop linkUserFeedItem - we have enough tables as is. Use a column in tblFeedItem to track read status*/
DROP TABLE linkUserFeedItem;

ALTER TABLE tblFeedItem
ADD COLUMN
fitIsRead BOOLEAN;

UPDATE tblFeedItem SET fitIsRead = false;

ALTER TABLE tblFeedItem
ALTER COLUMN fitIsRead SET NOT NULL;
