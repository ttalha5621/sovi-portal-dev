import React from 'react'
import { useForm } from 'react-hook-form'
import { SOVI_CONSTANTS } from '../../utils/constants'
import Input from '../common/Input'
import Button from '../common/Button'

interface EconomicFormData {
  QAGRI?: number
  REMITT?: number
  ECoH?: number
  BHU_F?: number
  Fmly_P?: number
  Sch_F?: number
  Vat_F?: number
  Agro_F?: number
  Pol_F?: number
}

interface EconomicFormProps {
  initialData?: EconomicFormData
  onSubmit: (data: EconomicFormData) => void
  loading?: boolean
}

const EconomicForm: React.FC<EconomicFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EconomicFormData>({
    defaultValues: initialData
  })

  const subParams = SOVI_CONSTANTS.PARAMETERS.ECONOMIC.subParams

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
            {...register(param.key as keyof EconomicFormData, {
              valueAsNumber: true,
              min: { value: 0, message: 'Value must be positive' },
              max: { value: 100, message: 'Value cannot exceed 100' }
            })}
            error={errors[param.key as keyof EconomicFormData]?.message}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Economic Data
        </Button>
      </div>
    </form>
  )
}

export default EconomicForm