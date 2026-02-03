import React from 'react'
import { useForm } from 'react-hook-form'
import { SOVI_CONSTANTS } from '../../utils/constants'
import Input from '../common/Input'
import Button from '../common/Button'

interface FacilityFormData {
  TENURE?: number
  ROOMS?: number
  ELECTRIC?: number
  TAPWATER?: number
  MEDIA?: number
  INTERNET?: number
}

interface FacilityFormProps {
  initialData?: FacilityFormData
  onSubmit: (data: FacilityFormData) => void
  loading?: boolean
}

const FacilityForm: React.FC<FacilityFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FacilityFormData>({
    defaultValues: initialData
  })

  const subParams = SOVI_CONSTANTS.PARAMETERS.FACILITY.subParams

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subParams.map((param) => (
          <Input
            key={param.key}
            label={param.label}
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register(param.key as keyof FacilityFormData, {
              valueAsNumber: true,
              min: { value: 0, message: 'Value must be positive' },
              max: { value: 100, message: 'Value cannot exceed 100' }
            })}
            error={errors[param.key as keyof FacilityFormData]?.message}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Facility Data
        </Button>
      </div>
    </form>
  )
}

export default FacilityForm