import React from 'react'
import { useForm } from 'react-hook-form'
import { SOVI_CONSTANTS } from '../../utils/constants'
import Input from '../common/Input'
import Button from '../common/Button'

interface PopulationFormData {
  QOLD?: number
  QMID?: number
  Fpop?: number
  Rpop?: number
  Upop?: number
  QKIDS?: number
  Growth_Rate?: number
}

interface PopulationFormProps {
  initialData?: PopulationFormData
  onSubmit: (data: PopulationFormData) => void
  loading?: boolean
}

const PopulationForm: React.FC<PopulationFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PopulationFormData>({
    defaultValues: initialData
  })

  const subParams = SOVI_CONSTANTS.PARAMETERS.POPULATION.subParams

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
            {...register(param.key as keyof PopulationFormData, {
              valueAsNumber: true,
              min: { value: 0, message: 'Value must be positive' },
              max: { value: 100, message: 'Value cannot exceed 100' }
            })}
            error={errors[param.key as keyof PopulationFormData]?.message}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Population Data
        </Button>
      </div>
    </form>
  )
}

export default PopulationForm