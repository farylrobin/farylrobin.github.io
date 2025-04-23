import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css'; // We'll create this for basic styling

// --- Configuration ---
const N8N_WEBHOOK_URL = 'https://farylrobin.app.n8n.cloud/webhook/4d30abde-69b0-4ba4-8f48-62963667fccc';
const DROPZONE_IDENTIFIERS = [
    "Inventory",
    "Sales",
    "On-Order",
    "Returns",
    "Forecasting",
    "Reviews"
];
// ---------------------

function FileUpload({ identifier, onFilesAdded, onFileRemoved, stagedFiles }) {
    const onDrop = useCallback(acceptedFiles => {
        // Add identifier to each file object for later reference
        const filesWithIdentifier = acceptedFiles.map(file => Object.assign(file, {
            dropzoneIdentifier: identifier,
            preview: URL.createObjectURL(file) // Optional: for image previews
        }));
        onFilesAdded(identifier, filesWithIdentifier);
    }, [identifier, onFilesAdded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            // 'image/*': ['.jpeg', '.png'],
            // 'text/csv': ['.csv'],
            // 'application/vnd.ms-excel': ['.xls'],
            // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        }
    });

    const handleRemoveFile = (e, fileToRemove) => {
        e.stopPropagation(); // Prevent triggering the dropzone click
        onFileRemoved(identifier, fileToRemove);
        // Clean up object URL
        if (fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
    };

    return (
        <div className="file-upload-container">
            <h3 className="dropzone-title">{identifier}</h3>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <p>Upload Here</p>
                {isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>(Drag 'n' drop files, or click)</p>
                }
            </div>
            {stagedFiles && stagedFiles.length > 0 && (
                <aside className="staged-files">
                    <h4>Staged Files:</h4>
                    <ul>
                        {stagedFiles.map((file, index) => (
                            <li key={`${file.name}-${index}`}>
                                {file.name} ({Math.round(file.size / 1024)} KB)
                                <button onClick={(e) => handleRemoveFile(e, file)} className="remove-button">
                                    &times; {/* Simple 'x' character */}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </div>
    );
}

function App() {
    // State to hold files for all dropzones, keyed by identifier
    const [filesByDropzone, setFilesByDropzone] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Called by FileUpload when files are added
    const handleFilesAdded = useCallback((identifier, newFiles) => {
        setFilesByDropzone(prev => ({
            ...prev,
            [identifier]: [...(prev[identifier] || []), ...newFiles]
        }));
        // Clear status messages on new file add
        setError(null);
        setSuccessMessage(null);
    }, []);

    // Called by FileUpload when a file is removed
    const handleFileRemoved = useCallback((identifier, fileToRemove) => {
        setFilesByDropzone(prev => {
            const currentFiles = prev[identifier] || [];
            const updatedFiles = currentFiles.filter(file => file !== fileToRemove);
            // If no files left for this identifier, remove the key
            if (updatedFiles.length === 0) {
                const { [identifier]: _, ...rest } = prev; // Remove identifier key
                return rest;
            }
            return {
                ...prev,
                [identifier]: updatedFiles
            };
        });
    }, []);

    const handleSubmit = async () => {
        const submissionTime = new Date().toISOString();
        const allFiles = Object.values(filesByDropzone).flat();

        if (allFiles.length === 0) {
            setError("No files selected to upload.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append('submissionTime', submissionTime);

        // Append each file with a unique key and include metadata
        const fileMetadata = [];
        allFiles.forEach((file, index) => {
            // Use a unique key for each file in FormData to avoid overwrites
            const uniqueFileKey = `${file.dropzoneIdentifier}_${index}`;
            formData.append(uniqueFileKey, file, file.name);
            // Add metadata for this file
            fileMetadata.push({
                formDataKey: uniqueFileKey,
                originalName: file.name,
                size: file.size,
                type: file.type,
                dropzoneIdentifier: file.dropzoneIdentifier
            });
        });

        // Append metadata array as a JSON string
        formData.append('metadata', JSON.stringify(fileMetadata));

        try {
            const response = await axios.post(N8N_WEBHOOK_URL, formData, {
                headers: {
                    // 'Content-Type': 'multipart/form-data'
                },
                // onUploadProgress: (progressEvent) => {
                //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                //     console.log(`Upload Progress: ${percentCompleted}%`);
                // }
            });

            console.log('Upload successful:', response.data);
            const now = new Date();
            const formatted = now.toLocaleString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            }) + ' @ ' + now.toLocaleTimeString('en-US', {
              hour12: false, hour: '2-digit', minute: '2-digit'
            });
            setSuccessMessage(`Files uploaded ${formatted}`);
            setFilesByDropzone({});
            // Revoke all object URLs after upload
            allFiles.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
        } catch (err) {
            console.error("Upload failed:", err);
            setError(`Upload failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Check if there are any files staged across all dropzones
    const hasFilesStaged = Object.values(filesByDropzone).some(files => files.length > 0);

    return (
        <div className="app-container">
            <div className="dropzone-grid">
                {DROPZONE_IDENTIFIERS.map(id => (
                    <FileUpload
                        key={id}
                        identifier={id}
                        onFilesAdded={handleFilesAdded}
                        onFileRemoved={handleFileRemoved}
                        stagedFiles={filesByDropzone[id] || []}
                    />
                ))}
            </div>

            <div className="submit-section">
                {error && <p className="message error-message">Error: {error}</p>}
                {successMessage && <p className="message success-message">{successMessage}</p>}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !hasFilesStaged}
                    className="submit-button"
                >
                    {isLoading ? 'Uploading...' : 'Upload New Data'}
                </button>
                {isLoading && <p className="message">Please wait...</p>}
            </div>
        </div>
    );
}

export default App;