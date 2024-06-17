# IPA-Code-Test

# Full Stack Web Developer Take-Home Challenge
 
**Duration: 4 hours**
 
**Objective:** Create a CRUD application which allows users to upload images,
tag them with metadata, and search for images based on metadata (title,
description, and tags). The application should have a frontend UI using a
modern stack using React (meta-frameworks like Next.js or Remix encouraged).
The backend should be a RESTful API using Node.js (Express.js, Fastify, Adonis,
or similar). Store the images in S3 and persist the metadata in a relational
database, managed by an ORM.
 
## Frontend (React)
 
- Create a form which allows users to upload an image, and add a title,
 description, and tags.
- Validate the user input, and display appropriate error messages if the input
 is invalid.
- Display a gallery of images with their titles, descriptions, and tags.
- Allow users to search for images by title, description, and tags.
- Allow users to delete images.
- Allow users to update an existing record.
 
## Backend (Node.js)
 
- Create a RESTful API which allows the user to Create, Update, Read, and
 Delete images, and search for images by title, description, and tags.
- Validate and sanitise the user input, and return appropriate error messages
 if the input is invalid.
- Store the images in S3.
- Persist the metadata in a relational database using an ORM, and ensure that
 the database schema is in sync with the application.
 
## Database
 
- Use a relational database (PostgreSQL, MySQL, SQLite, etc.).
 
## AWS
 
- Store the images in an S3 bucket.
- Deploy the application to AWS.
- (Optional) Deploy the application using Infrastructure as Code (IaC).



## SETUP REQUIREMENT

1. Create .env file in the root folder
2. Setup your local db and add these config in your .env file
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=root
    DB_NAME=ImageDB
    PORT=3000

3. Setup AWS Config and add these config into your .env file
    REGION=yourS3Region
    ASSESS_KEY_ID=YourAccessKeyID
    SECRET_ACCESS_KEY=YourSecretAccessKey
    S3_BUCKET_NAME=yourS3bucketName


4. Setup .env.local in client/image-storage
    AUTH0_SECRET=yourAuth0Secret
    AUTH0_BASE_URL='http://localhost:3001'
    AUTH0_ISSUER_BASE_URL=yourAuth0IssuerBase
    AUTH0_CLIENT_ID=yourAuth0ClientID
    AUTH0_CLIENT_SECRET=yourAuth0ClientSecret

    NEXT_PUBLIC_BASE_URL='http://localhost:3000'

5. Run the server\ImageDB_Script.sql script to create the databse and tables
6. Run npm i on server and client to install node modules dependencies
7. You are ready to run your application