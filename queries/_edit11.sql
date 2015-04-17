/* drop tbltag and linkfeedchanneltag. simplify our structure by moving tags directly to tblfeedchannel*/
DROP TABLE linkfeedchanneltag;
DROP TABLE tbltag;

ALTER TABLE tblfeedchannel
ADD COLUMN 
fedFeedChannelTags TEXT;