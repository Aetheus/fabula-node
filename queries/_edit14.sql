
/* this table saves the user's appsettings(a JSON string called "globalSettings") into the DB*/

CREATE TABLE tblUserAppSettings (
	uasUserID			TEXT	references tblUser(usrUserID) ON DELETE CASCADE ON UPDATE CASCADE,
	uasGlobalSettings	TEXT	DEFAULT '{}'
);


