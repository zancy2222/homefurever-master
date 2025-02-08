import './Users.css';
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';  // Import axios
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import TheImage from './assets/mainbg.png'
import TheLogo from './assets/logo.png'
import Dropdown from 'react-bootstrap/Dropdown';
import UserPh from './assets/userph.jpg';
import AuthContext from '../../context/AuthContext';

const PinkNavigationBar = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [notifications, setNotifications] = useState([]); // State for notifications

    // Fetch adoption status on component mount
    useEffect(() => {
        if (user) {
            // Fetch notifications from the backend using Axios
            axios.get(`http://localhost:8000/api/adoptions/status/${user.id}`)
                .then(response => {
                    setNotifications(response.data); // Set the fetched notifications
                })
                .catch(error => {
                    console.log("Error fetching notifications", error);
                });
        }
    }, [user]); // Trigger this effect when the user logs in or changes

    const handleAccountRedirect = () => navigate('/account');
    const handleLogout = () => {
        logout();  
        navigate('/');  
    };

    return (
        <div id="user-nav">
            <Navbar className="pinknavbar">
                <Image src={TheLogo} className="plogo" />

                <Container className="pnavcontainer">
                    <Navbar.Brand className="pnavtitle"></Navbar.Brand>

                    <div className="pnavlink-container">
                        <NavLink to="/browse/pets" className="pnavlink">Home</NavLink>
                    </div>

                    <div className="pnavlink-container">
                        <NavLink to="/aboutus" className="pnavlink">About Us</NavLink>
                    </div>

                    <div className="pnavlink-container">
                        <NavLink to="/pet/events" className="pnavlink">Events</NavLink>
                    </div>

                    <div className="pnavlink-container">
                        <NavLink to="/nearbyservices" className="pnavlink">Nearby Services</NavLink>
                    </div>

                    <div className="pnavlink-container">
                        <NavLink to="/message" className="pnavlink">Messages</NavLink>
                    </div>

                    <div className="pnavlink-container">
                        <Dropdown align="end">
                            <Dropdown.Toggle as={CustomToggle} id="pnotifications-dropdown">
                                <p className="pnotifheader">Notifications</p>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="pnotifications-menu" style={{ marginTop: '.7rem' }}>
                                <Dropdown.Header>Notifications</Dropdown.Header>
                                {notifications.map(notification => (
                                    <Dropdown.Item key={notification.id} className="pnotification-item">
                                        <div className="pnotification-content">
                                            <Image src={UserPh} roundedCircle className="pnotification-img" />
                                            <div className="pnotification-text">
                                                <span>{notification.text}</span>
                                            </div>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                                {notifications.length === 0 && (
                                    <Dropdown.Item disabled>No notifications</Dropdown.Item>
                                )}
                                <Dropdown.Item className="psee-all">See previous notifications</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="pnavlink-container">
                        <Dropdown align="end">
                            <Dropdown.Toggle as={CustomToggle} id="account-dropdown">
                                <p className="pnotifheader">Account</p>
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ marginTop: '.7rem' }}>
                                <Dropdown.Item onClick={handleAccountRedirect}>
                                    My Account
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Container>
            </Navbar>
        </div>
    );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        className="custom-dropdown-toggle"
    >
        {children}
    </a>
));

export default PinkNavigationBar;
