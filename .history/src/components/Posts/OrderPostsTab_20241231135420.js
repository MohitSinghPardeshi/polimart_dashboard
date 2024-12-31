import React, { useState } from 'react';
import { fetchPosts, updatePostOrderNew } from '../../services/postService';
import '../../css/Posts/OrderPostsTab.css';


const OrderPostsTab = ({ configData }) => {
    const [selectedParty, setSelectedParty] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedcategory, setSelectedcategory] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [postOrder, setPostOrder] = useState([]);

    const handleFetchPosts = async () => {
        if (!selectedcategory && !selectedLanguage) {
            alert('Please select category and language.');
            return;
        }
        setIsLoading(true);
        try {
            
            const fetchedPosts = await fetchPostsWithLanguage(selectedcategory,selectedLanguage);
            setPosts(fetchedPosts);
            setPostOrder(fetchedPosts.map((post) => post.postId)); // Store initial post order
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('postIndex', index);
    };

    const handleDrop = (e, index) => {
        const draggedIndex = e.dataTransfer.getData('postIndex');
        const reorderedPosts = [...posts];
        const [draggedPost] = reorderedPosts.splice(draggedIndex, 1);
        reorderedPosts.splice(index, 0, draggedPost);
        setPosts(reorderedPosts);
        setPostOrder(reorderedPosts.map((post) => post.postId)); // Update post order
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpdateOrder = async () => {
        setIsReordering(true);
        try {
            await updatePostOrderNew(postOrder,selectedcategory);
            alert('Post order updated successfully.');
        } catch (error) {
            console.error('Error updating post order:', error);
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <div className="order-posts-tab">
            {/* Dropdown for selecting a party */}
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

            {/* Dropdown for selecting a state */}
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
                    value={selectedLanguage} // Bind this to selectedLanguage state
                    onChange={(e) => setSelectedLanguage(e.target.value)} // Update state with selected language
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
                <label htmlFor="categorySelect">Select Category</label>
                <select
                    id="categorySelect"
                    className="input-field"
                    value={selectedcategory}
                    onChange={(e) => setSelectedcategory(e.target.value)}
                >
                    <option value="">Select a category</option>
                    {configData?.categories?.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Fetch button */}
            <button className="button" onClick={handleFetchPosts} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'Fetch Posts'}
            </button>

            {/* Update post order button */}
            {posts.length > 0 && (
                <button className="button" onClick={handleUpdateOrder} disabled={isReordering}>
                    {isReordering ? 'Updating...' : 'Update Post Order'}
                </button>
            )}

            {/* Display posts and allow reordering */}
            {posts.length > 0 && (
                <div className="post-list">
                    {posts.map((post, index) => (
                        <div
                            key={post.postId}
                            className="post-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                        >
                            <img src={post.url} alt="Post" className="post-image" />
                        </div>
                    ))}
                </div>
            )}

            
        </div>
    );
};

export default OrderPostsTab;
