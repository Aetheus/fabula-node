CREATE TABLE tblDecoTheme (
	thmUserID				TEXT	references tblUser(usrUserID),
	thmDecoThemeColour1		TEXT,
	thmDecoThemeColour2		TEXT,
	thmDecoThemeFontSize	INTEGER,
	thmDecoThemeFontName	TEXT
);

INSERT INTO tblDecoTheme (thmUserID,thmDecoThemeColour1,thmDecoThemeColour2,thmDecoThemeFontSize,thmDecoThemeFontName)
 VALUES ('superuser','red','red','14','Arial');

