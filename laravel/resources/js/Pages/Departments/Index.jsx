import { usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DepartmentsTable from './DepartmentsTable';

export default function Index({ departments }) {
    const { permissions, auth } = usePage().props;
    const user = auth?.user;
    const mainRole = user?.roles?.[0]?.name || 'employee';
    const roleLabel = mainRole.charAt(0).toUpperCase() + mainRole.slice(1);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="app-container">
            <Toaster position="top-right" />
            <div className="dashboard-auth-root">
                <style>{`
                    body { background: #eaf0fa; }
                    .dashboard-auth-root {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #eaf0fa 60%, #fff 100%);
                        font-family: 'Segoe UI', Arial, sans-serif;
                    }
                    .navbar {
                        width: 100%;
                        height: 64px;
                        background: #fff;
                        color: #232946;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding: 0 40px;
                        box-sizing: border-box;
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 100;
                        box-shadow: 0 2px 16px rgba(80,80,180,0.07);
                        animation: navbarFadeIn 1s;
                    }
                    @keyframes navbarFadeIn {
                        from { opacity: 0; transform: translateY(-30px);}
                        to { opacity: 1; transform: translateY(0);}
                    }
                    .navbar .profile-menu {
                        position: relative;
                        margin-left: 20px;
                        display: flex;
                        align-items: center;
                    }
                    .navbar .avatar {
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #a7c7e7 60%, #1563ff 100%);
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 1.1em;
                        margin-right: 10px;
                        box-shadow: 0 2px 8px rgba(80,80,180,0.10);
                    }
                    .navbar .profile-btn {
                        background: none;
                        border: none;
                        color: #232946;
                        font-weight: bold;
                        font-size: 1.05em;
                        cursor: pointer;
                        padding: 8px 16px;
                        border-radius: 20px;
                        transition: background 0.2s;
                    }
                    .navbar .profile-btn:hover {
                        background: #eaf0fa;
                    }
                    .navbar .dropdown {
                        position: absolute;
                        right: 0;
                        top: 110%;
                        background: #fff;
                        color: #232946;
                        border-radius: 12px;
                        box-shadow: 0 4px 24px rgba(80,80,180,0.13);
                        min-width: 170px;
                        overflow: hidden;
                        opacity: 0;
                        pointer-events: none;
                        transform: translateY(-10px);
                        transition: all 0.25s;
                    }
                    .navbar .profile-menu.open .dropdown {
                        opacity: 1;
                        pointer-events: auto;
                        transform: translateY(0);
                    }
                    .navbar .dropdown a, .navbar .dropdown button {
                        display: block;
                        width: 100%;
                        padding: 12px 20px;
                        background: none;
                        border: none;
                        text-align: left;
                        color: #232946;
                        font-size: 1em;
                        cursor: pointer;
                        transition: background 0.18s;
                    }
                    .navbar .dropdown a:hover, .navbar .dropdown button:hover {
                        background: #eaf0fa;
                    }
                    .sidebar {
                        position: fixed;
                        top: 64px;
                        left: 0;
                        width: 240px;
                        height: calc(100vh - 64px);
                        background: #fff;
                        color: #232946;
                        padding: 36px 18px 24px 18px;
                        box-shadow: 2px 0 24px rgba(80,80,180,0.08);
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        border-right: 1px solid #e0e7ff;
                        animation: sidebarSlideIn 1.1s;
                        border-radius: 0 18px 18px 0;
                    }
                    @keyframes sidebarSlideIn {
                        from { opacity: 0; transform: translateX(-40px);}
                        to { opacity: 1; transform: translateX(0);}
                    }
                    .sidebar .user-name {
                        font-size: 1.18em;
                        font-weight: bold;
                        margin-bottom: 4px;
                    }
                    .sidebar .role {
                        font-size: 0.98em;
                        color: #1563ff;
                        margin-bottom: 22px;
                    }
                    .sidebar ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        width: 100%;
                    }
                    .sidebar li {
                        display: inline-block;
                        background: linear-gradient(90deg, #eaf0fa 60%, #1563ff 100%);
                        color: #fff;
                        margin: 0 8px 12px 0;
                        padding: 7px 16px;
                        border-radius: 20px;
                        font-size: 0.98em;
                        font-weight: 500;
                        transition: box-shadow 0.2s, transform 0.18s, background 0.18s;
                        cursor: pointer;
                        box-shadow: 0 2px 8px rgba(80,80,180,0.07);
                        animation: fadeInPerm 0.7s;
                    }
                    .sidebar li:hover {
                        box-shadow: 0 4px 16px #1563ff44;
                        transform: scale(1.07);
                        background: #1563ff;
                    }
                    @keyframes fadeInPerm {
                        from { opacity: 0; transform: translateX(-20px);}
                        to { opacity: 1; transform: translateX(0);}
                    }
                    .main-content {
                        margin-left: 240px;
                        padding-top: 90px;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: fadeInMain 1.2s;
                    }
                    @keyframes fadeInMain {
                        from { opacity: 0; transform: scale(0.97);}
                        to { opacity: 1; transform: scale(1);}
                    }
                    .welcome-box {
                        background: #fff;
                        border-radius: 18px;
                        box-shadow: 0 4px 32px rgba(80,80,180,0.10);
                        padding: 48px 36px;
                        min-width: 320px;
                        max-width: 800px;
                        text-align: center;
                        animation: fadeInWelcome 1.5s;
                    }
                    @keyframes fadeInWelcome {
                        from { opacity: 0; transform: translateY(30px);}
                        to { opacity: 1; transform: translateY(0);}
                    }
                    .welcome-box h1 {
                        font-size: 2.1em;
                        margin-bottom: 12px;
                        color: #1563ff;
                        letter-spacing: 1px;
                    }
                    .departments-table {
                        width: 100%;
                        border-collapse: collapse;
                        background: white;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        margin-top: 20px;
                    }
                    .departments-table th {
                        background: #1563ff;
                        color: #fff;
                        padding: 12px;
                        text-align: left;
                        font-weight: 600;
                    }
                    .departments-table td {
                        padding: 12px;
                        border-top: 1px solid #eaf0fa;
                    }
                    .departments-table tr:hover {
                        background: #f8f9fa;
                    }
                `}</style>
                {/* Navbar */}
                <nav className="navbar">
                    <div className={`profile-menu${profileOpen ? ' open' : ''}`} onMouseLeave={() => setProfileOpen(false)}>
                        <span className="avatar">{initials}</span>
                        <button
                            className="profile-btn"
                            onClick={() => setProfileOpen((v) => !v)}
                            type="button"
                        >
                            {user?.name} &#x25BC;
                        </button>
                        <div className={`dropdown${profileOpen ? ' open' : ''}`}>
                            <a href="/profile">Modifier profil</a>
                            <form onSubmit={handleLogout}>
                                <button type="submit">Déconnexion</button>
                            </form>
                        </div>
                    </div>
                </nav>
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="user-name">{user?.name}</div>
                    <div className="role">{roleLabel}</div>
                    <ul>
                        {permissions && permissions.length > 0 ? (
                            permissions.map((perm) => (
                                <li key={perm}>{perm}</li>
                            ))
                        ) : (
                            <li style={{ color: '#aaa' }}>Aucune permission</li>
                        )}
                    </ul>
                </aside>
                {/* Main Content */}
                <main className="main-content">
                    <div className="welcome-box">
                        <DepartmentsTable departments={departments} />
                    </div>
                </main>
            </div>
        </div>
    );
} 