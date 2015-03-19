CREATE TABLE tblUser (
	usrUserID				TEXT 	primary key NOT NULL,
	usrUserPassword			TEXT 	NOT NULL,
	usrUserPasswordSalt		TEXT,
	usrUserPasswordQuestion	TEXT 	NOT NULL,
	usrUserPasswordAnswer	TEXT	NOT NULL,

	usrUserIsActive			BOOLEAN NOT NULL
);

/*ALTER TABLE tblUser ADD COLUMN usrUserIsActive BOOLEAN NOT NULL;*/

INSERT INTO tblUser (usrUserID,usrUserPassword,usrUserPasswordQuestion,usrUserPasswordAnswer,usrUserIsActive) 
 VALUES ('superuser', 'superuser', 'What is the password? (hint, its superuser)', 'superuser', 'true');