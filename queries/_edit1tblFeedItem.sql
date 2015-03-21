ALTER TABLE tblFeedItem 
ADD COLUMN 
fitTimeStamp TIMESTAMP WITH TIME ZONE NOT NULL;
/*
	Note: timestamp with timezone will always convert INSERTS into UTC, and SELECT results into UTC + the timezone difference
	1. Make sure user has set timezone (e.g: UTC +8)
	2. When user submits to system, convert to UTC time (e.g: user submits as 16.00 in his local timezone, we convert that to 12.00+08 before submit to system)
	3. Store that UTC-timed value in DB
	4. When DB returns it via a SELECT, it will be spit out as 16.00
*/



ALTER TABLE tblFeedItem
ADD UNIQUE 
(fitFeedChannelID,fitFeedItemTitle,
	fitFeedItemLink,fitFeedItemDescription);
/*Add unique constraint on the channelID, item title, item link and item description */


