"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter  } from 'next/navigation';

export default function FileDetailsPage() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [fileDetails, setFileDetails] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/media/${id}`);
        setFileDetails(response.data.media);
        setFileUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching file details:', error);
      }
    };
    if (id) {
      fetchFileDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/media/${id}`);
      alert('File deleted successfully');
      router.push('/files');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

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
      <p>File Path: {fileUrl}</p>
      <img src={fileUrl}></img>
      <button onClick={handleDelete}>Delete File</button>
      {/* Add more details as needed */}
    </div>
  );
}
