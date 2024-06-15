"use client"
import { useState } from "react"
import postMediaData from "../api/handleMediaApi";

export default function UploadPage() {

    const [name, setName] = useState('');
    const [fileName, setFileName] = useState('');
    const [size, setSize] = useState('');
    const [type, setType] = useState('');

    function handleFileChange(event: any) {
        const selectedFile = event.target.files?.[0] || null;
        setFileName(selectedFile.name);
        setSize(selectedFile.size);
        setType(selectedFile.type);
        console.log("FILE DETAILS: ", selectedFile);
    }

    function handleSubmit(event: any){
        event.preventDefault();
        const finalData = {name, fileName, size, type};
        console.log('Submitted data:' , finalData);
        const url = 'http://localhost:3000/api/media';
        postMediaData(url, finalData);
    }

    return (
        <div>
            <h1>Hello from Upload page</h1>
            <div className="mx-10">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Upload File</h2>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="filename" className="block text-sm font-medium leading-6 text-gray-900">File name</label>
                                    <div className="mt-2">
                                        <input type="text" name="filename" id="filename" value={name} onChange={(e) => setName(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <div className="mt-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                            id="file_input"
                                            type="file"
                                            onChange={handleFileChange} />
                                        <p>{fileName ?
                                            <>
                                                `File name: {fileName}, <br />
                                                File Size: {size} bytes` <br />
                                                File Type: {type}`
                                            </>
                                            : 'No file selected'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                <button type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Upload</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}