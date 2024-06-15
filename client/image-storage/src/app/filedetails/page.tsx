"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function FileDetailsPage() {

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [fileDetails, setFileDetails] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/media/${id}`);
        setFileDetails(response.data);
      } catch (error) {
        console.error('Error fetching file details:', error);
      }
    };
    if (id) {
      fetchFileDetails();
    }
  }, [id]);

  if (!fileDetails) {
    return <p>Loading file details...</p>;
  }

  return (
    <div>
      <h1>File Details</h1>
      <p>Name: {fileDetails.name}</p>
      <p>File Type: {fileDetails.fileType}</p>
      <p>Uploaded By: {fileDetails.uploadedBy}</p>
      <p>Created At: {new Date(fileDetails.createdAt).toLocaleString()}</p>
      {/* Add more details as needed */}
    </div>
  );
}
