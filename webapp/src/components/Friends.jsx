import React, { useState, useEffect, useContext } from 'react';
import { Snackbar } from "@mui/material";
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import { SessionContext } from '../SessionContext';
import '../css/friends.css';
const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
const Friends = ({goTo}) => {
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const {sessionData } = useContext(SessionContext); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const fetchData = async () => {
        try {
            const response = await axios.get(`${gatewayUrl}/getFriends/${sessionData.username}`, {
                headers: {
                    Authorization: `Bearer ${sessionData.token}`
                }
            });
            if (response.status === 200) {
                setFriends(response.data);
            }
        } catch (e) {
            setError(e);
            setSnackbarMessage(e.response.data || 'error_getting_friends')
        }
    };
    useEffect(() => {

        const handleLoad = () => {
            fetchData();
        };

        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };

    const handleAddFriend = () => {
        if (searchQuery === '') {
            return;
        }

        const addFriend = async () => {
            try {
                const body= {user: sessionData.username, friend: searchQuery};
                const response = await axios.post(`${gatewayUrl}/addfriend`, body
                , {
                    headers: {
                        Authorization: `Bearer ${sessionData.token}`
                    }
                });
                if (response.status === 200) {
                    
                    setFriends(response.data);
                    setSearchQuery('');
                    setOpenSnackbar(true);
                    setSnackbarMessage('friend_added')
                }
            } catch (e) {
                setError(e);
                setSnackbarMessage(e.response.data.error || 'error_adding_friend')
            }
        };

        addFriend();
    };

    const handleInputChange = event => {
        setSearchQuery(event.target.value);
    };
    const handleDeleteFriend = (friend) => {
        const deletefriend = async (friend) => {
            try {
                const response = await axios.delete(`${gatewayUrl}/deletefriend/${sessionData.username}/${friend}`, {
                    headers: {
                        Authorization: `Bearer ${sessionData.token}`
                    }
                });
                if (response.status === 200) {
                    setFriends(response.data);
                    setOpenSnackbar(true);
                    setSnackbarMessage('friend_deleted');
                }
            } catch (e) {
                setError(e);
                setSnackbarMessage(e.response.data.error || 'error_deleting_friend');
            }
        };
        deletefriend(friend);
    }
    return (
        <main>
            <h1 id='friendsListTitle'><FormattedMessage id="friend_list" tagName="span" /></h1>
            <div className='searchForm'>
                <input type="text" value={searchQuery} onChange={handleInputChange} />
                <button className='btn' onClick={handleAddFriend}><FormattedMessage id="addFriend" tagName="span" /></button>
            </div>
            <div id='friends'>
                {friends && friends.friends && friends.friends.length>0 ? (
                    <table className='tableFriends'>
                        <thead>
                            <tr>
                                <th><FormattedMessage id="username" tagName="span" /></th>
                                <th><FormattedMessage id="actions" tagName="span" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {friends.friends.map(friend => (
                                    <tr key={friend}  >
                                        <td className='upEffect'>
                                            <span className='friendName'>{friend}</span>
                                        </td>
                                        <td className='actions_container upEffect'>
                                            <div className='button_container'>
                                                <button className='btn' onClick={() => handleDeleteFriend(friend)}><FormattedMessage id="delete_friend" tagName="span" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                            
                        </tbody>
                    </table>
                ) : (
                    <div><span><FormattedMessage id="no_friends_yet" tagName="span" /></span></div>
                )}
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={<FormattedMessage id={snackbarMessage} />} />
            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={<FormattedMessage id={snackbarMessage} />} />
            )}
        </main>
    );
};

export default Friends;