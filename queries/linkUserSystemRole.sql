CREATE TABLE linkUserSystemRole (
	linkUserID				TEXT	references tblUser(usrUserID) ON DELETE CASCADE ON UPDATE CASCADE,
	linkSystemRoleID		TEXT	references tblSystemRole(srlRoleID) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO linkUserSystemRole (linkUserID, linkSystemRoleID) 
 VALUES ('superuser','administrator'); 

/*references tableName(tableColumn) makes this column a foreign key*/