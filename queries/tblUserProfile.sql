CREATE TABLE tblUserProfile (
	upfUserID	TEXT	references tblUser(usrUserID),
	upfUserProfileName	TEXT,
	upfUserProfileSex	TEXT,
	upfUserProfileEmail	TEXT
);

INSERT INTO tblUserProfile (upfUserID, upfUserProfileName)
 VALUES ('superuser','the site superuser');