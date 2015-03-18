CREATE TABLE linkUserSystemRole (
	linkUserID		TEXT	references tblUser(usrUserID),
	linkRoleID		TEXT	references tblSystemRole(srlRoleID)
);

INSERT INTO linkUserSystemRole (linkUserID, linkUserSystemRole) 
 VALUES ("superuser","administrator"); 

/*references tableName(tableColumn) makes this column a foreign key*/