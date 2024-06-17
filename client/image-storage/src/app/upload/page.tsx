"use client"
import { useEffect, useState } from "react"
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function UploadPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const { user } = useUser();
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [userEmail, setUserEmail] = useState('');

    
    useEffect(() => {
        if (user) {
            setUserEmail(user.email || '');
        }
    }, [user]);

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleFormSubmit = async (e: any) => {
        e.preventDefault();

        if (!file) {
            console.error('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('email', userEmail);

        try {
            const response = await axios.post(`${baseUrl}/api/media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Upload successful:', response.data);
            router.push('/files');
        } catch (error) {
            console.error('Failed to upload file:', error);
        }
    };

    const isFormInvalid = !file || name.trim() === "" || description.trim() === "";

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold mb-4">Upload File</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">File Details</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label htmlFor="filename" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="filename"
                                        id="filename"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter title"
                                        className="block w-full rounded-md border-0 py-1.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                        className="block w-full rounded-md border-0 py-1.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Enter description"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="col-span-full">
                                <div className="mt-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                                    <input
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        id="file_input"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                        </div>
                        {file ? (
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex-shrink-0 w-16 h-16">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="object-cover w-full h-full rounded-lg shadow-md"
                                    />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg"></div>
                                <div>
                                    <p className="text-base font-semibold text-gray-400">No file selected</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                     <button
            type="submit"
            disabled={isFormInvalid}
            className={`px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isFormInvalid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Upload
          </button>
                </div>
            </form>
        </div>
    );
}