import React from 'react'
import { useForm } from 'react-hook-form'
import { SOVI_CONSTANTS } from '../../utils/constants'
import Input from '../common/Input'
import Button from '../common/Button'

interface HealthFormData {
  DIARR?: number
  IMMUN?: number
  WTTI?: number
  CbyladyH_W_PRE?: number
  CbyladyH_W_POST?: number
  PNCONSL?: number
  FERTILITY?: number
  CHDISABL?: number
}

interface HealthFormProps {
  initialData?: HealthFormData
  onSubmit: (data: HealthFormData) => void
  loading?: boolean
}

const HealthForm: React.FC<HealthFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<HealthFormData>({
    defaultValues: initialData
  })

  const subParams = SOVI_CONSTANTS.PARAMETERS.HEALTH.subParams

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
            {...register(param.key as keyof HealthFormData, {
              valueAsNumber: true,
              min: { value: 0, message: 'Value must be positive' },
              max: { value: 100, message: 'Value cannot exceed 100' }
            })}
            error={errors[param.key as keyof HealthFormData]?.message}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Health Data
        </Button>
      </div>
    </form>
  )
}

export default HealthForm