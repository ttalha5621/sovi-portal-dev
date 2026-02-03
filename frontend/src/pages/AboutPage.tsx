import React from 'react'
import Header from '../components/common/Header'

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">About SOVI Portal</h1>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 mb-4">
                            The Social Vulnerability Index (SoVI) Portal provides comprehensive analysis
                            of social vulnerability across districts in Pakistan.
                        </p>
                        <p className="text-gray-600 mb-6">
                            This platform helps researchers, policymakers, and communities understand
                            and address social vulnerability factors.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                            <li>Interactive Map Visualization of Districts</li>
                            <li>Detailed Parameter Analysis (Education, Health, Economic, etc.)</li>
                            <li>Historical Trend Analysis</li>
                            <li>Comparative Analysis between Districts</li>
                            <li>Admin Dashboard for Data Management</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Methodology</h2>
                        <p className="text-gray-600">
                            The SoVI score is calculated based on multiple indicators grouped into five main parameters.
                            Each parameter contributes to the overall vulnerability score, allowing for targeted interventions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage