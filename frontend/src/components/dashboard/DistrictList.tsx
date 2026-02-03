import React, { useState, useMemo } from 'react'
import { DistrictListItem } from '../../types/district.types'
import { getRatingColor, formatScore } from '../../utils/calculations'
import { FiSearch, FiFilter, FiChevronRight, FiMapPin } from 'react-icons/fi'
import './DistrictList.css'

interface DistrictListProps {
    districts: DistrictListItem[]
    onSelectDistrict: (districtId: number) => void
    selectedDistrict: any
}

const DistrictList: React.FC<DistrictListProps> = ({
    districts,
    onSelectDistrict,
    selectedDistrict,
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'name' | 'score' | 'rating'>('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    // Filter and sort districts
    const filteredAndSortedDistricts = useMemo(() => {
        let filtered = districts.filter(district =>
            district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            district.province?.toLowerCase().includes(searchQuery.toLowerCase())
        )

        // Sort districts
        filtered.sort((a, b) => {
            let aValue: any, bValue: any

            switch (sortBy) {
                case 'score':
                    aValue = a.soviScore || 0
                    bValue = b.soviScore || 0
                    break
                case 'rating':
                    aValue = a.rating || 0
                    bValue = b.rating || 0
                    break
                case 'name':
                default:
                    aValue = a.name.toLowerCase()
                    bValue = b.name.toLowerCase()
                    break
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        return filtered
    }, [districts, searchQuery, sortBy, sortDirection])

    const toggleSort = (column: 'name' | 'score' | 'rating') => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(column)
            setSortDirection('asc')
        }
    }

    const getSortIcon = (column: 'name' | 'score' | 'rating') => {
        if (sortBy !== column) return null

        return (
            <span className="sort-icon">
                {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
        )
    }

    return (
        <div className="district-list">
            {/* Search and Filter */}
            <div className="district-list-header">
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search districts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="search-clear"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="filter-container">
                    <button className="filter-button">
                        <FiFilter />
                        Filter
                    </button>
                </div>
            </div>

            {/* Sort Controls */}
            <div className="sort-controls">
                <button
                    onClick={() => toggleSort('name')}
                    className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                >
                    Name {getSortIcon('name')}
                </button>
                <button
                    onClick={() => toggleSort('score')}
                    className={`sort-button ${sortBy === 'score' ? 'active' : ''}`}
                >
                    Score {getSortIcon('score')}
                </button>
                <button
                    onClick={() => toggleSort('rating')}
                    className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`}
                >
                    Rating {getSortIcon('rating')}
                </button>
            </div>

            {/* District Count */}
            <div className="district-count">
                <span className="count-text">
                    {filteredAndSortedDistricts.length} districts found
                </span>
            </div>

            {/* Districts List */}
            <div className="districts-container">
                {filteredAndSortedDistricts.length === 0 ? (
                    <div className="no-districts">
                        <FiMapPin className="no-districts-icon" />
                        <p className="no-districts-text">No districts found</p>
                    </div>
                ) : (
                    <ul className="districts-list">
                        {filteredAndSortedDistricts.map((district) => {
                            const isSelected = selectedDistrict?.id === district.id
                            const scoreColor = getRatingColor(district.soviScore || 0)

                            return (
                                <li
                                    key={district.id}
                                    className={`district-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => onSelectDistrict(district.id)}
                                >
                                    <div className="district-info">
                                        <h3 className="district-name">{district.name}</h3>
                                        {district.province && (
                                            <p className="district-province">{district.province}</p>
                                        )}
                                    </div>

                                    <div className="district-score">
                                        <div
                                            className="score-badge"
                                            style={{ backgroundColor: scoreColor }}
                                        >
                                            {formatScore(district.soviScore)}
                                        </div>
                                        <div className="district-rating">
                                            <span className="rating-label">Rating:</span>
                                            <span className="rating-value">{district.rating || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <FiChevronRight className="district-arrow" />
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {/* Summary */}
            <div className="district-summary">
                <div className="summary-item">
                    <span className="summary-label">Total Districts:</span>
                    <span className="summary-value">{districts.length}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Average Score:</span>
                    <span className="summary-value">
                        {formatScore(
                            districts.reduce((acc, d) => acc + (d.soviScore || 0), 0) /
                            (districts.length || 1)
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default DistrictList