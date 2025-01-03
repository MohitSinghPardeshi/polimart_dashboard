import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadImage, createPost } from '../../services/uploadService';
import '../../css/Posts/UploadTab.css';

const UploadTab = ({ configData }) => {
    const [selectedParty, setSelectedParty] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [compressedFileUrl, setCompressedFileUrl] = useState(null);
    const [originalSize, setOriginalSize] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isFormComplete = scheduledTime && imageFile && selectedCategory.length > 0;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const originalFileSize = (file.size / 1024).toFixed(2);
            setOriginalSize(originalFileSize);

            const options = {
                maxSizeMB: 0.05,
                useWebp: true,
                fileType: 'image/webp',
                alwaysKeepResolution: true,
            };

            try {
                const compressed = await imageCompression(file, options);
                const compressedFileSize = (compressed.size / 1024).toFixed(2);
                setCompressedSize(compressedFileSize);
                setImageFile(compressed);
            } catch (error) {
                console.error('Error compressing the image:', error);
            }
        }
    };

    const handleUpload = async () => {
        if (!isFormComplete) {
            alert('Please select both party, state, category, scheduled time and image to upload.');
            return;
        }

        setIsUploading(true);
        try {
            const uploadResponse = await uploadImage(imageFile, 'IMAGE');
            const fileUrl = uploadResponse;

            const postData = {
                description: '',
                sangh: 'Polimart',
                language: selectedLanguage,
                mediaType: 'IMAGE',
                liveAt: new Date(scheduledTime).getTime(),
                categoryIds: selectedCategory,
                url: fileUrl,
                political: false,
            };

            if (selectedCategory.includes('9af1a16a-7852-4a64-8d67-fd6e3987c9de')) {
                postData.party = selectedParty;
                postData.state = selectedState;
                postData.political = true;
            }

            console.log('Post Data:', JSON.stringify(postData, null, 2));

            await createPost(postData);
            setUploadSuccess(true);

        } catch (error) {
            console.error('Error during upload or post creation:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleToggleCategory = (categoryId) => {
        setSelectedCategory((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="upload-pane">
            <div className="form-group">
                <label htmlFor="partySelect">Select Party</label>
                <select
                    id="partySelect"
                    className="input-field"
                    value={selectedParty}
                    onChange={(e) => setSelectedParty(e.target.value)}
                >
                    <option value="">Select a party</option>
                    {configData?.parties?.map((party) => (
                        <option key={party} value={party}>
                            {party}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="stateSelect">Select State</label>
                <select
                    id="stateSelect"
                    className="input-field"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                >
                    <option value="">Select a state</option>
                    {configData?.states?.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="languageSelect">Select Language</label>
                <select
                    id="languageSelect"
                    className="input-field"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    <option value="">Select a language</option>
                    {configData?.languages?.map((language) => (
                        <option key={language} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Select Categories</label>
                <div className="custom-multiselect">
                    <div className="selected-categories" onClick={toggleDropdown}>
                        {selectedCategory.length > 0 ? selectedCategory.join(', ') : 'Select categories'}
                    </div>
                    {dropdownOpen && (
                        <div className="dropdown-options">
                            {configData?.categories?.map((category) => (
                                <div
                                    key={category.categoryId}
                                    className={`dropdown-option ${selectedCategory.includes(category.categoryId) ? 'selected' : ''}`}
                                    onClick={() => handleToggleCategory(category.categoryId)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategory.includes(category.categoryId)}
                                        readOnly
                                    />
                                    {category.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <p>Selected Categories: {selectedCategory.join(', ')}</p>
            </div>

            <div className="form-group">
                <label htmlFor="scheduleTime">Schedule Post Time</label>
                <input
                    type="datetime-local"
                    id="scheduleTime"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="imageUpload">Select Image</label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {originalSize && <p>Original Image Size: {originalSize} KB</p>}
            {compressedSize && <p>Compressed Image Size: {compressedSize} KB</p>}

            <button
                className="button"
                onClick={handleUpload}
                disabled={!isFormComplete || isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>

            {uploadSuccess && <p>Upload and post creation successful!</p>}
        </div>
    );
};

export default UploadTab;