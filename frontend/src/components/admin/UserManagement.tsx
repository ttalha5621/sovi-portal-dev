import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import Input from '../common/Input'
import Modal from '../common/Modal'
import LoadingSpinner from '../common/LoadingSpinner'
import {
    FiUsers,
    FiUserPlus,
    FiEdit,
    FiTrash2,
    FiSearch,
    FiFilter,
    FiShield,
    FiUser,
    FiMail,
    FiLock
} from 'react-icons/fi'
import './UserManagement.css'

interface User {
    id: number
    name: string
    email: string
    role: 'ADMIN' | 'USER'
    createdAt: string
    status: 'active' | 'inactive'
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showUserForm, setShowUserForm] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const { user: currentUser } = useAuth()

    // Mock users data - in real app, this would come from API
    const mockUsers: User[] = [
        {
            id: 1,
            name: 'System Administrator',
            email: 'admin@sovi.gov.pk',
            role: 'ADMIN',
            createdAt: '2024-01-15',
            status: 'active'
        },
        {
            id: 2,
            name: 'Data Analyst',
            email: 'analyst@sovi.gov.pk',
            role: 'USER',
            createdAt: '2024-02-20',
            status: 'active'
        },
        {
            id: 3,
            name: 'Viewer User',
            email: 'viewer@sovi.gov.pk',
            role: 'USER',
            createdAt: '2024-03-10',
            status: 'active'
        },
    ]

    useEffect(() => {
        // Simulate API call
        const fetchUsers = async () => {
            setLoading(true)
            setTimeout(() => {
                setUsers(mockUsers)
                setLoading(false)
            }, 1000)
        }

        fetchUsers()
    }, [])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateUser = () => {
        setSelectedUser(null)
        setShowUserForm(true)
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setShowUserForm(true)
    }

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        if (selectedUser) {
            // In real app, call API to delete user
            setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
            setShowDeleteConfirm(false)
            setSelectedUser(null)
        }
    }

    const handleUserFormSubmit = (data: any) => {
        if (selectedUser) {
            // Update existing user
            setUsers(prev => prev.map(u =>
                u.id === selectedUser.id ? { ...u, ...data } : u
            ))
        } else {
            // Create new user
            const newUser: User = {
                id: users.length + 1,
                name: data.name,
                email: data.email,
                role: data.role,
                createdAt: new Date().toISOString().split('T')[0],
                status: 'active'
            }
            setUsers(prev => [...prev, newUser])
        }
        setShowUserForm(false)
        setSelectedUser(null)
    }

    if (loading) {
        return (
            <div className="users-loading">
                <LoadingSpinner message="Loading users..." />
            </div>
        )
    }

    return (
        <div className="user-management">
            {/* Header */}
            <div className="users-header">
                <div className="header-left">
                    <h2 className="users-title">User Management</h2>
                    <p className="users-subtitle">
                        Manage user accounts and permissions
                    </p>
                </div>
                <div className="header-right">
                    <Button
                        variant="primary"
                        icon={<FiUserPlus />}
                        onClick={handleCreateUser}
                    >
                        Add User
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="users-filters">
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-actions">
                    <Button variant="outline" icon={<FiFilter />}>
                        Filter
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="users-table">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">
                                            {user.role === 'ADMIN' ? <FiShield /> : <FiUser />}
                                        </div>
                                        <div className="user-info">
                                            <div className="user-name">{user.name}</div>
                                            <div className="user-id">ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="email-cell">
                                        <FiMail className="email-icon" />
                                        {user.email}
                                    </div>
                                </td>
                                <td>
                                    <div className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </div>
                                </td>
                                <td>
                                    <div className={`status-badge ${user.status}`}>
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </div>
                                </td>
                                <td>{user.createdAt}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="action-button edit"
                                            title="Edit user"
                                            disabled={user.id === currentUser?.id}
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user)}
                                            className="action-button delete"
                                            title="Delete user"
                                            disabled={user.id === currentUser?.id}
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

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="empty-state">
                    <FiUsers className="empty-icon" />
                    <h3 className="empty-title">No users found</h3>
                    <p className="empty-text">
                        {searchQuery ? 'Try adjusting your search terms' : 'Add your first user'}
                    </p>
                </div>
            )}

            {/* Stats */}
            <div className="users-stats">
                <div className="stat-card">
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value">{users.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Active</div>
                    <div className="stat-value">
                        {users.filter(u => u.status === 'active').length}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Admins</div>
                    <div className="stat-value">
                        {users.filter(u => u.role === 'ADMIN').length}
                    </div>
                </div>
            </div>

            {/* User Form Modal */}
            <Modal
                isOpen={showUserForm}
                onClose={() => {
                    setShowUserForm(false)
                    setSelectedUser(null)
                }}
                title={selectedUser ? 'Edit User' : 'Create User'}
                size="medium"
            >
                <UserForm
                    user={selectedUser}
                    onSubmit={handleUserFormSubmit}
                    onCancel={() => {
                        setShowUserForm(false)
                        setSelectedUser(null)
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                size="small"
            >
                <div className="delete-confirm">
                    <p className="confirm-text">
                        Are you sure you want to delete user "{selectedUser?.name}"?
                        This action cannot be undone.
                    </p>
                    <div className="confirm-actions">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                        >
                            Delete User
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

interface UserFormProps {
    user: User | null
    onSubmit: (data: any) => void
    onCancel: () => void
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'USER',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="form-grid">
                <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    fullWidth
                />

                <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    fullWidth
                />

                <div className="form-field">
                    <label className="field-label">Role</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'USER' })}
                        className="select-input"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                </div>

                {!user && (
                    <>
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            icon={<FiLock />}
                            fullWidth
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            icon={<FiLock />}
                            fullWidth
                        />
                    </>
                )}
            </div>

            <div className="form-actions">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    {user ? 'Update User' : 'Create User'}
                </Button>
            </div>
        </form>
    )
}

export default UserManagement