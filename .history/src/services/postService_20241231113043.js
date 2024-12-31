import apiService from './apiService';

// Fetch 100 posts based on selected party and state (language)
export const fetchPosts = async (categoryId) => {
    const url  = (`/post/v1/post/category?categoryId=${categoryId}`);
    console.log(url);
    // const response = await apiService.get(`post/v1/post/category?categoryId=9af1a16a-7852-4a64-8d67-fd6e3987c9de`);
     const response = await apiService.get(`/post/v1/post/category?categoryId=${categoryId}&sangh=Polimart`);
    return response.data.posts; // Assuming the posts are in the "posts" array
};

export const fetchPostFilter = async (categoryId) => {
    const url = 'https://backend.polimart.in/polimart/post/v1/post/filter?limit=18';

    // Headers
    const headers = {
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJQb2xpbWFydEFkbWluIiwiaWF0IjoxNzM0OTYwNjkxLCJVU0VSX0NMQUlNIjp7InVzZXJJZCI6IlBvbGltYXJ0QWRtaW4ifSwiZXhwIjoxNzY2NDk2NjkxfQ.tP4_sYz0ED-mLPI9w5aH5wk06EscsIDJ5BHWTsPNKK4',
        'app-User-Id': 'PolimartAdmin',
        'Content-Type': 'application/json',
    };

    // Request Body
    const body = {
        categoryId: 'a6807f12-1ab3-4bde-afd4-2a7c4ef009db',
        language: 'HINDI',
        sangh: 'Polimart',
        limit: 18,
    };

    // Make POST request
    const response = await apiService.post(url, body, { headers });

    // Return posts from response
    return response.data.posts; /
};


// Fetch 100 posts based on selected party and state (language)
export const fetchPostsWithSangh = async (categoryId,sanghId) => {
    const url  = (`/post/v1/post/category?categoryId=${categoryId}`);
    console.log(url);
    // const response = await apiService.get(`post/v1/post/category?categoryId=9af1a16a-7852-4a64-8d67-fd6e3987c9de`);
     const response = await apiService.get(`/post/v1/post/category?categoryId=${categoryId}&sangh=${sanghId}`);
    return response.data.posts; // Assuming the posts are in the "posts" array
};

// Update post order with the new list of postIds
export const updatePostOrder = async (postIds) => {
    const queryString = postIds.map((id) => `postIds=${id}`).join('&');
    const response = await apiService.put(`/post/v1/post/order?${queryString}&sangh=Polimart`);
    return response.data; // Assuming a success response
};

// Update post order with the new list of postIds
export const updateSanghPostOrder = async (postIds,sanghId,categoryId) => {
    const queryString = postIds.map((id) => `postIds=${id}`).join('&');
    const response = await apiService.put(`/post/v1/post/order?${queryString}&sangh=${sanghId}&categoryId=${categoryId}&language=HINDI`);
    return response.data; // Assuming a success response
};

// Delete a post by postId
export const deletePost = async (postId) => {
    const response = await apiService.delete(`/post/v1/post/${postId}`);
    return response.data;
};
