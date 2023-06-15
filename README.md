# crud-api
CRUD backend api.
clone the repo
`cd ./crud-api`<br>

To Install the dependencies.<br>
`npm install`<br>

create `config.env` file inside config folder and assign all the values to variables inside the file.<br>
```
NODE_ENV=
PORT=

MONGO_URI =

GEOCODER_PROVIDER = 
GEOCODER_API_KEY = 

FILE_UPLOAD_PATH=
MAX_FILE_UPLOAD=

JWT_SECRET=
JWT_EXPIRE=
JWT_COOKIE_EXPIRE=

SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=
FROM_EMAIL=
FROM_NAME= 
```
<br>
Run the following commmand inside main directory<br>
`npm run dev`<br>

go the specified PORT in config and you will have all the available endpoints of the API. 
