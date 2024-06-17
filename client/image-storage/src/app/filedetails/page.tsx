"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FileDetailsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [fileDetails, setFileDetails] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/media/${id}`);
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
      await axios.delete(`${baseUrl}/api/media/${id}`);
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4">File Details</h1>
      {fileUrl && (
        <div className="mb-4">
          <img src={fileUrl} alt={fileDetails.name} className="max-w-md h-auto rounded-lg shadow-sm mx-auto" />
        </div>
      )}
      <div className="mb-4">
        <p className="text-lg font-semibold">Name: <span className="font-normal">{fileDetails.name}</span></p>
        <p className="text-lg font-semibold">Description: <span className="font-normal">{fileDetails.description}</span></p>
        <p className="text-lg font-semibold">File Type: <span className="font-normal">{fileDetails.fileType}</span></p>
        <p className="text-lg font-semibold">Uploaded By: <span className="font-normal">{fileDetails.uploadedByID}</span></p>
        <p className="text-lg font-semibold">Created At: <span className="font-normal">{new Date(fileDetails.uploadDate).toLocaleString()}</span></p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none"
        >
          Delete File
        </button>
        <Link href={{ pathname: `/editfile`, query: { id: fileDetails.id } }}>
          <span className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none">
            Edit
          </span>
        </Link>
      </div>
    </div>
  );
}
