import React, { useEffect,useCallback  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import decode from 'jwt-decode';
import { setCurrentUser } from '../../actions/currentUser';
import { setSearchQuery } from '../../actions/search';
import logo from '../../assets/logo-stackoverflow.png';
import logo1 from '../../assets/icon.png';
import search from '../../assets/magnifying-glass-solid.svg';
import Avatar from '../../components/Avatar/Avatar';
import menu from '../../assets/bars-solid.svg';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  var User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    dispatch(setCurrentUser(null));
  }, [dispatch, navigate]);

  const handleMenu = () => {
    const navbar = document.getElementById('sidebar');
    navbar.style.left = '0%';
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
    dispatch(setSearchQuery(query));
  };

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem('Profile'))));
  }, [User?.token, dispatch]);

  return (
    <nav className="main-nav">
      <div className="navbar">
        <div>
          <button onClick={handleMenu} id="menu-btn" className="menu-btn">
            <img src={menu} alt="" width="18" />
          </button>
        </div>
        <Link to="/" className="nav-item nav-logo">
          <img src={logo} alt="logo" className="nav-img" />
          <img src={logo1} alt="logo" className="nav-img1" />
        </Link>
        <form>
          <input type="text" placeholder="search..." onChange={handleSearch} />
          <img src={search} alt="search" width="18" className="search-icon" />
        </form>

        {User === null ? (
          <Link to="/Auth" className="nav-item nav-links">
            Log in
          </Link>
        ) : (
          <>
            <Avatar
              backgroundColor="#009dff"
              px="10px"
              py="5px"
              borderRadius="50%"
              color="white"
              textDecoration="none"
            >
              <Link
                to={`/Users/${User?.result?._id}`}
                style={{ color: 'white', textDecoration: 'none' }}
              >
                {User.result.name?.charAt(0)?.toUpperCase()}
              </Link>
            </Avatar>

            <button className="nav-item nav-links" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;