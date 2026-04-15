EVERYONE SHOULD CREATE .env FILE IN SERVER FOLDER that has the following section:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=course_registration

Replace "your_mysql_password" with your real MySQL password. 

.env is in the .gitignore and therefore will not commit this to Github (PLEASE MAKE SURE TO NOT COMMIT .ENV FILE TO GITHUB, IT SHOULD BE IN .GITIGNORE ALREADY)