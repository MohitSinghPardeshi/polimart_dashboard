import apiClient from './apiService'; // Import apiService to make the API calls

// Function to delete a user by email ID
export const deleteUser = async (emailId) => {
    try {
        const response = await apiClient.delete('/user/v1/user', {
            params: { emailId },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error; // Rethrow error to handle it in the component
    }
};

export const getUserDetails = async (emailId) => {
    try {
        const response = await apiClient.get('/subscription/v1/user', {
            params: { emailId },
        });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const updateUser = async () => {
    const url = 'https://backend.polimart.in/polimart/user/v1/user';
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJQb2xpbWFydEFkbWluIiwiaWF0IjoxNzM0OTU0MzM1LCJVU0VSX0NMQUlNIjp7InVzZXJJZCI6IlBvbGltYXJ0QWRtaW4ifSwiZXhwIjoxNzY2NDkwMzM1fQ.QkSUnMk-sziKsEqC5FwW73L3DkCavHnYbMM0bf61pY0',
        'app-User-Id': 'PolimartAdmin',
    };
    const body = {
        sangh: 'Polimart',
        party: 'CONGRESS',
        state: 'UTTAR_PRADESH',
    };
    const response = await apiClient.put(url, body, { headers });
    return response.data;
};

