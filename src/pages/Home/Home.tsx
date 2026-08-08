import React from 'react';
import './home.css';
import logo from '../../public/download.webp';
import bg from '../../public/bg.jpg';

// Define the type for our service categories
interface Category {
    id: number;
    name: string;
    icon: string;
}

const CustomerHome: React.FC = () => {
    const categories: Category[] = [
        { id: 1, name: 'Loading/Unloading', icon: '📦' },
        { id: 2, name: 'Construction', icon: '🏗️' },
        { id: 3, name: 'Cleaning', icon: '🧹' },
        { id: 4, name: 'Farming Helper', icon: '🌾' },
    ];

    return (
        <div
            className="app-container"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Header */}
            <header className="header">
                <img src={logo} alt="Rozgarmitra Logo" className="logo-img" />
                <div className="location-badge">📍 Indore, MP</div>
                <div style={{ fontSize: '24px', cursor: 'pointer' }}>☰</div>
            </header>

            {/* Welcome Section */}
            <div style={{ padding: '20px' }}>
                <h1 style={{ margin: '0 0 5px 0' }}>Welcome, Rahul!</h1>
                <p style={{ margin: 0, color: '#666' }}>What kind of help do you need today?</p>
            </div>

            {/* Active Request Card (Conditionally shown) */}
            <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Active Request</h3>
                <p style={{ margin: 0 }}>Searching for nearby workers for <strong>Loading</strong>...</p>
            </div>

            {/* Services Grid */}
            <div style={{ padding: '0 20px' }}>
                <h3 style={{ marginBottom: '15px' }}>Our Services</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px'
                }}>
                    {categories.map((cat) => (
                        <div key={cat.id} style={{
                            backgroundColor: '#fff',
                            padding: '20px 10px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            border: '1px solid var(--light-blue)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cat.icon}</div>
                            <div style={{ fontWeight: '600', fontSize: '15px' }}>{cat.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerHome;