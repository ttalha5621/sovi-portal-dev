import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDistricts } from '../../context/DistrictContext'
import { districtSchema } from '../../utils/validators'
import { showSuccess, showError } from '../../utils/helpers'
import Button from '../common/Button'
import Input from '../common/Input'
import {
    FiSave,
    FiX,
    FiMapPin,
    FiGlobe,
    FiNavigation,
    FiHash
} from 'react-icons/fi'
import './DistrictForm.css'

interface DistrictFormProps {
    district?: any
    onSuccess: () => void
    onCancel: () => void
}

interface DistrictFormData {
    name: string
    fid?: string
    division?: string
    province?: string
    country: string
}

const DistrictForm: React.FC<DistrictFormProps> = ({
    district,
    onSuccess,
    onCancel
}) => {
    const [loading, setLoading] = useState(false)
    const { createDistrict, updateDistrict } = useDistricts()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DistrictFormData>({
        resolver: zodResolver(districtSchema),
        defaultValues: {
            name: district?.name || '',
            fid: district?.fid || '',
            division: district?.division || '',
            province: district?.province || '',
            country: district?.country || 'Pakistan',
        },
    })

    useEffect(() => {
        reset({
            name: district?.name || '',
            fid: district?.fid || '',
            division: district?.division || '',
            province: district?.province || '',
            country: district?.country || 'Pakistan',
        })
    }, [district, reset])

    const onSubmit = async (data: DistrictFormData) => {
        try {
            setLoading(true)

            if (district) {
                await updateDistrict(district.id, data)
                showSuccess('District updated successfully')
            } else {
                await createDistrict(data)
                showSuccess('District created successfully')
            }

            onSuccess()
        } catch (error: any) {
            showError(error.response?.data?.message || 'Operation failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="district-form">
            <div className="form-grid">
                {/* District Name */}
                <Input
                    label="District Name"
                    leftIcon={<FiMapPin />}
                    error={errors.name?.message}
                    fullWidth
                    {...register('name')}
                />

                {/* FID */}
                <Input
                    label="Feature ID (FID)"
                    leftIcon={<FiHash />}
                    error={errors.fid?.message}
                    helperText="Unique identifier from GIS system"
                    fullWidth
                    {...register('fid')}
                />

                {/* Division */}
                <Input
                    label="Division"
                    leftIcon={<FiNavigation />}
                    error={errors.division?.message}
                    fullWidth
                    {...register('division')}
                />

                {/* Province */}
                <Input
                    label="Province"
                    leftIcon={<FiGlobe />}
                    error={errors.province?.message}
                    fullWidth
                    {...register('province')}
                />

                {/* Country */}
                <Input
                    label="Country"
                    leftIcon={<FiGlobe />}
                    error={errors.country?.message}
                    fullWidth
                    {...register('country')}
                />
            </div>

            <div className="form-actions">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    <FiX />
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={<FiSave />}
                >
                    {district ? 'Update District' : 'Create District'}
                </Button>
            </div>
        </form>
    )
}

export default DistrictForm