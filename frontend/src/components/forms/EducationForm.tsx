import React from 'react'
import { useForm } from 'react-hook-form'
import { SOVI_CONSTANTS } from '../../utils/constants'
import Input from '../common/Input'
import Button from '../common/Button'

interface EducationFormData {
  NOSCL?: number
  PRIMSC?: number
  ENRLPR?: number
  ENRMA?: number
  PATS?: number
  ADLLIT?: number
}

interface EducationFormProps {
  initialData?: EducationFormData
  onSubmit: (data: EducationFormData) => void
  loading?: boolean
}

const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EducationFormData>({
    defaultValues: initialData
  })

  const subParams = SOVI_CONSTANTS.PARAMETERS.EDUCATION.subParams

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
            {...register(param.key as keyof EducationFormData, {
              valueAsNumber: true,
              min: { value: 0, message: 'Value must be positive' },
              max: { value: 100, message: 'Value cannot exceed 100' }
            })}
            error={errors[param.key as keyof EducationFormData]?.message}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Education Data
        </Button>
      </div>
    </form>
  )
}

export default EducationForm