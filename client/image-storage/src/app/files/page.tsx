"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function FilesPage() {

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
        const response = await axios.get('http://localhost:3000/api/media');
        setFiles(response.data);
    };

    fetchFiles();
  }, []);

    return (
        <>
          <div className="mx-10">
            <h1>All Files</h1>
            <ul className="divide-y divide-gray-100">
              {files.length > 0 ? (
                files.map(file => (
                  <li key={file.id} className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{file.name}</p>
                      </div>
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">Posted by: {file.uploadedBy}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">Created at: {new Date(file.createdAt).toLocaleString()}</p>
                      <Link href={{ pathname: `/filedetails`, query: {id: file.id}}}>
                  <span className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    View
                  </span>
                </Link>
                    </div>
                    
                  </li>
                ))
              ) : (
                <p>No files available.</p>
              )}
            </ul>
          </div>
        </>
      );
}
