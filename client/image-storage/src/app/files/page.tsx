"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function FilesPage() {
    const { user } = useUser();
    const [files, setFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (user) {
            setUserEmail(user.email || '');
        }
    
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/media', {
                    params: {
                        userEmail: user ? user.email || '' : ''
                    }
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
    
        if (userEmail) {
            fetchFiles();
        }
    }, [user, userEmail]);

    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedFiles = filteredFiles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

    return (
        <div className="mx-10 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Files</h1>
                <input
                    type="text"
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded"
                />
            </div>
            {filteredFiles.length > 0 ? (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Posted by
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFiles.map(file => (
                                <tr key={file.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {file.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {file.uploadedByID}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(file.uploadDate).toLocaleDateString('en-US', {
                                            month: '2-digit',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={{ pathname: `/filedetails`, query: { id: file.id } }}>
                                            <span className="rounded-md bg-blue-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
                                                View
                                            </span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4 p-4 bg-gray-50">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No files available.</p>
            )}
        </div>
    );
}
