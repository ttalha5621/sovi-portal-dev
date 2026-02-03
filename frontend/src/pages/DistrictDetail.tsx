import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDistricts } from '../context/DistrictContext'
import { useSoviData } from '../hooks/useSoviData'
import Header from '../components/common/Header'
import Sidebar from '../components/common/Sidebar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ParameterChart from '../components/charts/ParameterChart'
import ScoreChart from '../components/charts/ScoreChart'
import Button from '../components/common/Button'
import { FiArrowLeft, FiDownload, FiShare2 } from 'react-icons/fi'
import './DistrictDetail.css'

const DistrictDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { 
    selectedDistrict, 
    selectDistrict, 
    loading: districtLoading,
    fetchDistrictData,
    fetchComparativeAnalysis
  } = useDistricts()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'trends'>('overview')
  const [comparativeData, setComparativeData] = useState<any>(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)

  useEffect(() => {
    if (id) {
      const districtId = parseInt(id)
      selectDistrict(districtId)
      fetchDistrictData(districtId)
      
      // Fetch comparative analysis
      setAnalysisLoading(true)
      fetchComparativeAnalysis(districtId)
        .then(data => setComparativeData(data))
        .catch(console.error)
        .finally(() => setAnalysisLoading(false))
    }
  }, [id, selectDistrict, fetchDistrictData, fetchComparativeAnalysis])

  if (districtLoading || !selectedDistrict) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" message="Loading district details..." />
      </div>
    )
  }

  const { name, province, soviScore, rating, data } = selectedDistrict
  const latestData = data?.[0]

  // Prepare data for charts
  const parameterScores = latestData ? {
    Education: latestData.Sedu || 0,
    Health: latestData.Shealth || 0,
    Facility: latestData.Sfacility || 0,
    Economic: latestData.Seconomic || 0,
    Population: latestData.Spopulation || 0
  } : {}

  const trendData = data?.map(d => ({
    year: d.year,
    score: d.totalSoVI
  })) || []

  return (
    <div className="district-detail-page">
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  icon={<FiArrowLeft />}
                >
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                  <p className="text-gray-600">{province}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  icon={<FiShare2 />}
                  onClick={() => {}}
                >
                  Share
                </Button>
                <Button 
                  variant="primary" 
                  icon={<FiDownload />}
                  onClick={() => {}}
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">SoVI Score</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-primary-600">
                    {soviScore?.toFixed(2) || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500">/ 100</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Vulnerability Rating</h3>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${rating >= 4 ? 'bg-red-100 text-red-800' : 
                      rating >= 3 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}
                  >
                    {rating >= 4 ? 'High' : rating >= 3 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Data Year</h3>
                <span className="text-2xl font-semibold text-gray-900">
                  {latestData?.year || new Date().getFullYear()}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['overview', 'analysis', 'trends'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors
                        ${activeTab === tab 
                          ? 'border-primary-500 text-primary-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Parameter Analysis</h3>
                      <div className="h-80">
                        <ParameterChart data={parameterScores} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Key Indicators</h3>
                      <div className="space-y-4">
                        {Object.entries(parameterScores).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">{key}</span>
                              <span className="font-medium text-gray-900">{Number(value).toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'trends' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Historical Trends</h3>
                    <div className="h-80">
                      <ScoreChart 
                        data={trendData} 
                        xAxisKey="year" 
                        yAxisKey="score"
                        title="SoVI Score Trends"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'analysis' && (
                  <div>
                    {analysisLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner message="Loading analysis..." />
                      </div>
                    ) : comparativeData ? (
                      <div className="space-y-8">
                        {/* Comparative Chart */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Comparative Analysis</h3>
                          <div className="h-80">
                            <ScoreChart
                              data={[
                                { name: selectedDistrict.name, score: selectedDistrict.soviScore || 0 },
                                { name: 'Province Avg', score: comparativeData.provinceAverage },
                                { name: 'National Avg', score: comparativeData.nationalAverage }
                              ]}
                              type="bar"
                              xAxisKey="name"
                              yAxisKey="score"
                              title="SoVI Score Comparison"
                            />
                          </div>
                        </div>

                        {/* Similar Districts */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Similar Districts</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {comparativeData.similarDistricts?.map((district: any) => (
                              <div 
                                key={district.id}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => navigate(`/district/${district.id}`)}
                              >
                                <div className="font-medium text-gray-900">{district.name}</div>
                                <div className="text-sm text-gray-500">{district.province}</div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Score:</span>
                                  <span className="font-semibold text-primary-600">
                                    {district.soviScore?.toFixed(2) || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {(!comparativeData.similarDistricts || comparativeData.similarDistricts.length === 0) && (
                            <p className="text-gray-500 italic">No similar districts found.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        Failed to load analysis data.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DistrictDetail