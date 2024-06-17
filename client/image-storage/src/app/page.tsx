import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to FileUploader</h1>
        <p className="text-lg text-center mb-8">
          Easily upload and manage your files with our intuitive application.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Upload Files</h2>
            <p className="text-gray-700">
              Upload files of any type and size securely to our servers.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Organize and Manage</h2>
            <p className="text-gray-700">
              Organize your files into folders and manage them efficiently.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Share with Others</h2>
            <p className="text-gray-700">
              Share files securely with colleagues and clients via shareable links.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Access Anywhere</h2>
            <p className="text-gray-700">
              Access your uploaded files from anywhere, anytime.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-600">
        <p>&copy; 2024 FileUploader. All rights reserved.</p>
      </footer>
    </div>
  );
}
