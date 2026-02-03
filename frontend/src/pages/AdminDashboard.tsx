const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Districts</h3>
                        <p className="text-gray-600">Manage district data</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Users</h3>
                        <p className="text-gray-600">Manage user accounts</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Reports</h3>
                        <p className="text-gray-600">View system reports</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard