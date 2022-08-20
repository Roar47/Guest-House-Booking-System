
To make the connection there should be database with name 'guesthouse' and shuld have the following tables

    database name : 'guesthouse'

    Table customer 
        cid varchar(30) PRIMARY KEY,
        password varchar(30),
        name varchar(30),
        mobno varchar(15),
        email varchar(30),
        roomtype int,
        amount int default 0,
        paid int default 0,
        checkin date

    Table food
        fid varchar(30) PRIMARY KEY,
        fname varchar(30),
        ftype int,
        price int

    Table room
        rid varchar(30) PRIMARY KEY,
        rtype int (Room Type : 1,2,3 {Gold,Platinum,Diamond}),
        status int (1,0 {Occupied,Unoccupied})

  
 After making these table one should open the folder GuestHouse and then open the file app.js
 Now Open the terminal and write the code "npm start" and then the server will started at port 4000
 Now go to link address https://localhost:4000/ and the login page will be displayed.

    .......................................................................................................










