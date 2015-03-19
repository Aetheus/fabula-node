CREATE TABLE tblUserProfile (
	upfUserID	TEXT	references tblUser(usrUserID) ON DELETE CASCADE ON UPDATE CASCADE,
	upfUserProfileName	TEXT,
	upfUserProfileSex	TEXT,
	upfUserProfileEmail	TEXT
);

INSERT INTO tblUserProfile (upfUserID, upfUserProfileName)
 VALUES ('superuser','the site superuser');