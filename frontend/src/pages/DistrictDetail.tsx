import { useParams } from 'react-router-dom'

const DistrictDetail = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">District Details</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">District ID: {id}</p>
          <p className="text-gray-600">District information will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

export default DistrictDetail