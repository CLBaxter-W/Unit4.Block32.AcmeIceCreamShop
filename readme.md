/\***\* project initialization \*\***/
/\*

> npm install
> npm init -y
> npm i express pg morgan nodemon

create index.js
create .gitignore
add to file (so it doesn't include in check-in):
node_modules
package-lock.json
DS_Store

add script to package.json that starts application
"start:dev": "nodemon index.js"

Postman stuff...
Write the POST route:

    Select the next GET request in your collection.
    Logically rename the request. Using "createNote" is fine.
    On the left of the URL bar, select the GET dropdown to open it, and then select POST.
    Enter the URL for your POST route (http://localhost:3000/api/notes</code >).
    Below the URL bar, select Headers, and then add a key of Content-Type with a value of application/json. Notice that Postman gives suggestions for matching known keys and values.
    Below the URL bar, select Body, select raw, and then make sure that the data format dropdown to the right has JSON.
    In the body, enter the {"txt": "xyz","ranking": 4}, and then select the Beautify text to the right of the data format. Notice that as long as the data has the correct syntax, Postman formats your body data in an easy-to-read format.
    Save your request
