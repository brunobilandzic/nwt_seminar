import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';


const User = () => {
    const [userData, setUserData] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/users/${id}`);
                console.log(response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h1>User Page</h1>
            {userData && (
                <div>
                    <h2>{userData.username}</h2>
                    <p>Admin: {JSON.stringify(userData.isAdmin)}</p>
                </div>
            )}
        </div>
    );
};

export default User;
