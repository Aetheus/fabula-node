/* 
	unlike the more forgiving feeditemidentity constrint from edit9, 
	this constraint removes fitFeedItemImageLink from the constraint.
	This is in response to sites like MalaysiaKini that may use differing imageLinks at differing times (thumbnails).
*/



ALTER TABLE tblfeeditem DROP CONSTRAINT 
feeditemidentity;


/*trim leading/trailing whitespace*/
UPDATE tblfeeditem
SET fitfeeditemtitle = LTRIM(RTRIM(fitfeeditemtitle));


/*this deletes all existing duplicates that would violate our rule*/
DELETE FROM tblfeeditem 
WHERE fitfeeditemid NOT IN 
(	
	SELECT MIN(fitfeeditemid) 
	FROM tblfeeditem 
	GROUP BY fitFeedChannelID,fitFeedItemTitle,fitFeedItemLink,fitFeedItemDescription
);



ALTER TABLE tblfeeditem 
ADD CONSTRAINT feeditemidentity UNIQUE 
(fitFeedChannelID,fitFeedItemTitle,
	fitFeedItemLink,fitFeedItemDescription);