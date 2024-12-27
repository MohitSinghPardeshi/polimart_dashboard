import React, { useState } from 'react';
import { fetchPosts, updatePostOrder } from '../services/postService';
import '../css/OrderPostsTab.css';

const OrderPostsTab = ({ configData }) => {
    const [selectedParty, setSelectedParty] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [postOrder, setPostOrder] = useState([]);

    const handleFetchPosts = async () => {
        if (!selectedParty || !selectedState) {
            alert('Please select both party and state.');
            return;
        }
        setIsLoading(true);
        try {
            const fetchedPosts = await fetchPosts(selectedParty, selectedState);
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
            await updatePostOrder(postOrder);
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

            {/* Fetch button */}
            <button className="button" onClick={handleFetchPosts} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'Fetch Posts'}
            </button>

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

            {/* Update post order button */}
            {posts.length > 0 && (
                <button className="button" onClick={handleUpdateOrder} disabled={isReordering}>
                    {isReordering ? 'Updating...' : 'Update Post Order'}
                </button>
            )}
        </div>
    );
};

export default OrderPostsTab;
