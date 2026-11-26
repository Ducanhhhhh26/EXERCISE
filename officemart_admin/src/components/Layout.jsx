import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <>
            <header className="app-header">OfficeMart Admin</header>
            <main className="container"><Outlet /></main>
        </>
    );
}