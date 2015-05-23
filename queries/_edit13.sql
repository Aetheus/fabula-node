/* this edit brings colour settings to our tblfeedchannel */
/* this column holds CSS classes that determine what colour the tblfeedchannel will appear as in the user's app*/

ALTER TABLE tblfeedchannel
ADD COLUMN fedFeedChannelColour TEXT;
