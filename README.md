# indoorBK

IndoorBK is a project about mobile indoor navigation. It is a university project by Tom Broersen, Florian Fichtner, Merwin Rook and Ivo de Liefde. Since the project is in a very early stage it will limit its scope by only making indoor navigation on the campus of TU Delft. 

The aim is to build an Android app using HTML5 and Cordova. This is app is designed to be as simple as possible, using the input of the user's calendar to automatically find their next location. The only user input required is pressing a 'start navigation' button. For indoor positioning WiFi fingerprinting is used. For navigation there is a connection to a server using Node.JS. On the server side there is a database with the topological model of the building. 

Project files:
index.html is the main window that users see. Within it there are 2 pages: a home page and a navigation page. 

checkCalendar.js is the javascript file that holds the calendar functionality. It retrieves the user's next appointment.

getRSSi.js is the javascript file that retrieves the RSSi values of the WiFI networks and passes them along to the server.
