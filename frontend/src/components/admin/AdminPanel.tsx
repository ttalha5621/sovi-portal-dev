import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useDistricts } from '../../context/DistrictContext'
import Header from '../common/Header'
import DistrictForm from './DistrictForm'
import DataEntryForm from './DataEntryForm'
import UserManagement from './UserManagement'
import Modal from '../common/Modal'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import {
    FiUsers,
    FiMap,
    FiDatabase,
    FiSettings,
    FiBarChart2,
    FiUpload,
    FiDownload,
    FiPlus,
    FiEdit,
    FiTrash2
} from 'react-icons/fi'
import './AdminPanel.css'

type AdminTab = 'districts' | 'data' | 'users' | 'settings' | 'analytics'

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('districts')
    const [showDistrictForm, setShowDistrictForm] = useState(false)
    const [showDataForm, setShowDataForm] = useState(false)
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null)

    const { user } = useAuth()
    const { districts, loading, fetchDistricts } = useDistricts()

    const tabs = [
        { id: 'districts', label: 'Districts', icon: <FiMap /> },
        { id: 'data', label: 'Data Entry', icon: <FiDatabase /> },
        { id: 'users', label: 'Users', icon: <FiUsers /> },
        { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
    ]

    const handleDistrictEdit = (district: any) => {
        setSelectedDistrict(district)
        setShowDistrictForm(true)
    }

    const handleDistrictDelete = async (districtId: number) => {
        if (window.confirm('Are you sure you want to delete this district?')) {
            // Delete logic would go here
            console.log('Delete district:', districtId)
        }
    }

    const handleBulkUpload = () => {
        // Bulk upload logic
        console.log('Bulk upload')
    }

    const handleExportData = () => {
        // Export logic
        console.log('Export data')
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <LoadingSpinner size="large" message="Loading admin panel..." />
            </div>
        )
    }

    return (
        <div className="admin-panel">
            <Header />

            <div className="admin-container">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Admin Panel</h2>
                        <p className="sidebar-subtitle">Welcome, {user?.name}</p>
                    </div>

                    <nav className="sidebar-nav">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id as AdminTab)}
                            >
                                <span className="nav-icon">{tab.icon}</span>
                                <span className="nav-label">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <Button
                            variant="outline"
                            icon={<FiUpload />}
                            fullWidth
                            onClick={handleBulkUpload}
                        >
                            Bulk Upload
                        </Button>
                        <Button
                            variant="outline"
                            icon={<FiDownload />}
                            fullWidth
                            onClick={handleExportData}
                        >
                            Export Data
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <div className="main-header">
                        <h1 className="main-title">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>

                        {activeTab === 'districts' && (
                            <Button
                                variant="primary"
                                icon={<FiPlus />}
                                onClick={() => {
                                    setSelectedDistrict(null)
                                    setShowDistrictForm(true)
                                }}
                            >
                                Add District
                            </Button>
                        )}

                        {activeTab === 'data' && (
                            <Button
                                variant="primary"
                                icon={<FiPlus />}
                                onClick={() => setShowDataForm(true)}
                            >
                                Add Data
                            </Button>
                        )}
                    </div>

                    <div className="main-content">
                        {activeTab === 'districts' && (
                            <div className="districts-section">
                                <div className="districts-stats">
                                    <div className="stat-card">
                                        <h3 className="stat-title">Total Districts</h3>
                                        <p className="stat-value">{districts.length}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h3 className="stat-title">Active</h3>
                                        <p className="stat-value">{districts.length}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h3 className="stat-title">Inactive</h3>
                                        <p className="stat-value">0</p>
                                    </div>
                                </div>

                                <div className="districts-table">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Province</th>
                                                <th>SoVI Score</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {districts.map((district) => (
                                                <tr key={district.id}>
                                                    <td>{district.id}</td>
                                                    <td className="font-medium">{district.name}</td>
                                                    <td>{district.province || '—'}</td>
                                                    <td>
                                                        <span className="score-badge">
                                                            {district.soviScore?.toFixed(2) || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="status-badge active">
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                onClick={() => handleDistrictEdit(district)}
                                                                className="action-button edit"
                                                                title="Edit"
                                                            >
                                                                <FiEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDistrictDelete(district.id)}
                                                                className="action-button delete"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="data-section">
                                <DataEntryForm />
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="users-section">
                                <UserManagement />
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="analytics-section">
                                <h3>Analytics Dashboard</h3>
                                <p>Analytics features coming soon...</p>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="settings-section">
                                <h3>System Settings</h3>
                                <p>Settings features coming soon...</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            <Modal
                isOpen={showDistrictForm}
                onClose={() => setShowDistrictForm(false)}
                title={selectedDistrict ? 'Edit District' : 'Add New District'}
                size="medium"
            >
                <DistrictForm
                    district={selectedDistrict}
                    onSuccess={() => {
                        setShowDistrictForm(false)
                        fetchDistricts()
                    }}
                    onCancel={() => setShowDistrictForm(false)}
                />
            </Modal>

            <Modal
                isOpen={showDataForm}
                onClose={() => setShowDataForm(false)}
                title="Add District Data"
                size="large"
            >
                <DataEntryForm
                    onSuccess={() => setShowDataForm(false)}
                    onCancel={() => setShowDataForm(false)}
                />
            </Modal>
        </div>
    )
}

export default AdminPanel