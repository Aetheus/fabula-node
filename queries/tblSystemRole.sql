CREATE TABLE tblSystemRole (
	srlRoleID	TEXT	PRIMARY KEY,
	srlRoleDesc	TEXT	NOT NULL
);

INSERT INTO tblSystemRole (srlRoleID, srlRoleDesc) 
 VALUES ('administrator', 'Site Administrator');