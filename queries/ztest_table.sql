CREATE TABLE test_Table (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL 
);

INSERT INTO test_Table (id, name) VALUES (1, 'hello heroku app!');


/* Notes:
	1.	to login to local psql properly, execute this:
			psql -U postgres			--logins to default postgres db
			psql -U postgres -d mydb 	--logins to mydb
	   	that sets it up to login as the postgres user (as for the p/w, you should remember the password)

	2.	to execute this sql file, 
			psql -U postgres -d mydb -a -f test_table.sql
		if the database "mydb" doesn't exist: CREATE mydb.

*/