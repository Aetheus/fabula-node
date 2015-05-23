/*
DELETE t
FROM 
tblfeeditem t
WHERE EXISTS 
    (SELECT 1 FROM tblfeeditem 
    WHERE t.fitfeeditemid > fitfeeditemid AND t.City = City)
*/

DELETE FROM tblfeeditem 
WHERE fitfeeditemid NOT IN 
(	
	SELECT MIN(fitfeeditemid) 
	FROM tblfeeditem 
	GROUP BY fitFeedChannelID,fitFeedItemTitle,fitFeedItemLink,fitFeedItemDescription
);


/*
DELETE MyTable 
FROM MyTable
LEFT OUTER JOIN (
   SELECT MIN(fitFeedItemID) as fitFeedItemID, fitFeedChannelID,fitFeedItemTitle, fitFeedItemLink,fitFeedItemDescription
   FROM MyTable 
   GROUP BY Col1, Col2, Col3
) as KeepRows ON
   MyTable.RowId = KeepRows.RowId
WHERE
   KeepRows.RowId IS NULL    
*/   