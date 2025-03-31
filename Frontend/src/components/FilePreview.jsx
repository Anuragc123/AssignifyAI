"use client";

import { useState, useEffect } from "react";
import { FiX, FiFile, FiDownload, FiExternalLink } from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";

export default function FilePreviewModal({ isOpen, onClose, files }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Submitted Files
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {files && files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file, index) => (
                <FilePreviewItem key={index} file={file} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No files available for preview
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function FilePreviewItem({ file }) {
  const [previewError, setPreviewError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tempFile, setTempFile] = useState(null); 

  const fileExtension = file.name
    ? file.name.split(".").pop().toLowerCase()
    : "";

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);
  const isPdf = fileExtension === "pdf";
  const canPreview = isImage || isPdf;

  useEffect(() => {
    async function fetchTempFile() {
      if (!file.id) {
        setLoading(false); 
        setPreviewError(true); 
        return;
      }

      try {
        setLoading(true);
        setPreviewError(false); 
        setTempFile(null); 

        const response = await axios.get(
          `${baseUrl}/user/assignment/file/${file.id}`, 
          {
            withCredentials: true,
          }
        );

        if (response.data.success && response.data.file?.tempPath) {
          
          setTempFile(response.data.file);
        } else {
          console.error("Failed to get file data:", response.data.error);
          setPreviewError(true);
        }
      } catch (error) {
        console.error("Error fetching file:", error);
        setPreviewError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTempFile();
  }, [file.id]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center min-w-0">
          {" "}
          
          <FiFile className="text-indigo-500 mr-2 flex-shrink-0" />
          <span
            className="font-medium text-gray-700 truncate"
            title={file.name}
          >
            {file.name}
          </span>{" "}
        </div>
        
        {tempFile && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <a
              href={`${baseUrl}${tempFile.tempPath}`} // Uses tempPath
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Open in new tab"
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
            {/* <a
              href={`${baseUrl}${tempFile.tempPath}`}
              download={file.name} 
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Download"
            >
              <FiDownload className="w-4 h-4" />
            </a> */}
          </div>
        )}
      </div>

      {/* Preview Area */}
      {loading ? (
        <div className="p-6 text-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading file preview...</p>
        </div>
      ) : canPreview && !previewError && tempFile ? (
        // Display preview if possible and no errors
        <div className="p-4 bg-white">
          {isImage && (
            <img
              src={`${baseUrl}${tempFile.tempPath}`} // Uses tempPath
              alt={file.name}
              className="max-w-full h-auto max-h-[400px] mx-auto rounded"
              onError={() => setPreviewError(true)} // Handle image loading errors
            />
          )}
          {isPdf && (
            <div className="aspect-w-16 aspect-h-9 w-full">
              {" "}
              {/* Adjusted for better PDF view */}
              <iframe
                src={`${baseUrl}${tempFile.tempPath}#view=FitH`} // Uses tempPath
                className="w-full h-[500px] border-0" // Increased height
                title={file.name}
                onError={() => setPreviewError(true)} // Handle iframe loading errors
              />
            </div>
          )}
        </div>
      ) : (
        // Fallback for no preview or errors
        <div className="p-6 text-center bg-gray-50">
          <div className="text-gray-500 mb-2">
            {previewError
              ? "Preview failed to load or file is invalid"
              : "Preview not available for this file type"}
          </div>
          {/* Still offer download/open even if preview fails/unavailable, if tempFile exists */}
          {tempFile && !previewError && (
            <a
              href={`${baseUrl}${tempFile.tempPath}`} // Uses tempPath
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center text-sm"
            >
              <FiExternalLink className="mr-2" />
              Open File
            </a>
          )}
          {/* If there was an error loading tempFile itself */}
          {previewError && !tempFile && (
            <span className="text-red-500 text-sm">
              Could not load file details.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
