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