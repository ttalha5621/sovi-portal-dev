import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDistricts } from '../../context/DistrictContext'
import { useSoviData } from '../../hooks/useSoviData'
import { soviDataSchema } from '../../utils/validators'
import { showSuccess, showError } from '../../utils/helpers'
import { SOVI_CONSTANTS } from '../../utils/constants'
import Button from '../common/Button'
import Input from '../common/Input'
import LoadingSpinner from '../common/LoadingSpinner'
import {
    FiSave,
    FiX,
    FiCalculator,
    FiCalendar,
    FiMapPin
} from 'react-icons/fi'
import './DataEntryForm.css'

interface DataEntryFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

interface DataEntryFormData {
    districtId: number
    year: number
    // Education
    NOSCL?: number
    PRIMSC?: number
    ENRLPR?: number
    ENRMA?: number
    PATS?: number
    ADLLIT?: number
    // Health
    DIARR?: number
    IMMUN?: number
    WTTI?: number
    CbyladyH_W_PRE?: number
    CbyladyH_W_POST?: number
    PNCONSL?: number
    FERTILITY?: number
    CHDISABL?: number
    // Facility
    TENURE?: number
    ROOMS?: number
    ELECTRIC?: number
    TAPWATER?: number
    MEDIA?: number
    INTERNET?: number
    // Economic
    QAGRI?: number
    REMITT?: number
    ECoH?: number
    BHU_F?: number
    Fmly_P?: number
    Sch_F?: number
    Vat_F?: number
    Agro_F?: number
    Pol_F?: number
    // Population
    QOLD?: number
    QMID?: number
    Fpop?: number
    Rpop?: number
    Upop?: number
    QKIDS?: number
    Growth_Rate?: number
}

const DataEntryForm: React.FC<DataEntryFormProps> = ({
    onSuccess,
    onCancel
}) => {
    const [activeTab, setActiveTab] = useState<string>('education')
    const [calculatedScores, setCalculatedScores] = useState<any>(null)
    const [showCalculations, setShowCalculations] = useState(false)

    const { districts, loading: districtsLoading } = useDistricts()
    const { calculateScores, saveDistrictData, loading: soviLoading } = useSoviData()

    const currentYear = new Date().getFullYear()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<DataEntryFormData>({
        resolver: zodResolver(soviDataSchema),
        defaultValues: {
            year: currentYear,
        },
    })

    const formData = watch()

    // Calculate scores when form data changes
    useEffect(() => {
        const calculate = async () => {
            try {
                const scores = await calculateScores(formData)
                setCalculatedScores(scores)
            } catch (error) {
                // Ignore calculation errors during form changes
            }
        }

        if (Object.keys(formData).length > 2) { // districtId and year
            calculate()
        }
    }, [formData, calculateScores])

    const onSubmit = async (data: DataEntryFormData) => {
        try {
            await saveDistrictData(data)
            showSuccess('District data saved successfully')

            if (onSuccess) {
                onSuccess()
            }

            // Reset form
            reset()
            setCalculatedScores(null)
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to save data')
        }
    }

    const tabs = Object.entries(SOVI_CONSTANTS.PARAMETERS).map(([key, param]) => ({
        id: key,
        label: param.label,
        color: param.color,
    }))

    const renderParameterInputs = (parameterKey: string) => {
        const parameter = SOVI_CONSTANTS.PARAMETERS[parameterKey as keyof typeof SOVI_CONSTANTS.PARAMETERS]

        if (!parameter) return null

        return (
            <div className="parameter-inputs">
                <div className="inputs-grid">
                    {parameter.subParams.map((subParam) => (
                        <Input
                            key={subParam.key}
                            label={subParam.label}
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            fullWidth
                            {...register(subParam.key as any)}
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (districtsLoading) {
        return (
            <div className="form-loading">
                <LoadingSpinner message="Loading districts..." />
            </div>
        )
    }

    return (
        <div className="data-entry-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <div className="basic-info-section">
                    <h3 className="section-title">Basic Information</h3>
                    <div className="basic-info-grid">
                        <div className="district-select">
                            <label className="select-label">
                                <FiMapPin className="select-icon" />
                                District
                            </label>
                            <select
                                {...register('districtId', { valueAsNumber: true })}
                                className="select-input"
                            >
                                <option value="">Select a district</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name} {district.province ? `(${district.province})` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.districtId && (
                                <p className="error-message">{errors.districtId.message}</p>
                            )}
                        </div>

                        <Input
                            label="Year"
                            type="number"
                            leftIcon={<FiCalendar />}
                            error={errors.year?.message}
                            min="2000"
                            max="2100"
                            {...register('year', { valueAsNumber: true })}
                        />
                    </div>
                </div>

                {/* Parameter Tabs */}
                <div className="parameter-tabs-section">
                    <h3 className="section-title">Parameter Data</h3>
                    <div className="parameter-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                className={`parameter-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    borderColor: activeTab === tab.id ? tab.color : 'transparent',
                                    color: activeTab === tab.id ? tab.color : '#6b7280',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {renderParameterInputs(activeTab)}
                </div>

                {/* Calculated Scores */}
                {calculatedScores && (
                    <div className="calculated-scores">
                        <div className="scores-header">
                            <h3 className="section-title">
                                <FiCalculator className="inline mr-2" />
                                Calculated Scores
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowCalculations(!showCalculations)}
                                className="toggle-calculations"
                            >
                                {showCalculations ? 'Hide Details' : 'Show Details'}
                            </button>
                        </div>

                        <div className="scores-summary">
                            {Object.entries(calculatedScores).map(([key, value]) => {
                                if (key === 'totalSoVI' || key === 'rating') return null

                                return (
                                    <div key={key} className="score-item">
                                        <span className="score-label">{key}:</span>
                                        <span className="score-value">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {showCalculations && (
                            <div className="scores-details">
                                <div className="total-sovi">
                                    <div className="total-score">
                                        <span className="total-label">Total SoVI Score:</span>
                                        <span className="total-value">{calculatedScores.totalSoVI.toFixed(2)}</span>
                                    </div>
                                    <div className="total-rating">
                                        <span className="rating-label">Rating:</span>
                                        <span className="rating-value">{calculatedScores.rating}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={soviLoading}
                        >
                            <FiX />
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        loading={soviLoading}
                        icon={<FiSave />}
                    >
                        Save District Data
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default DataEntryForm