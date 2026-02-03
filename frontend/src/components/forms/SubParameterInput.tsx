import React from 'react'
import Input from '../common/Input'

interface SubParameterInputProps {
  label: string
  name: string
  value?: number
  onChange: (name: string, value: number) => void
  error?: string
  min?: number
  max?: number
  step?: number
  required?: boolean
}

const SubParameterInput: React.FC<SubParameterInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  min = 0,
  max = 100,
  step = 0.01,
  required = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value)
    if (!isNaN(numValue)) {
      onChange(name, numValue)
    }
  }

  return (
    <Input
      label={label}
      type="number"
      name={name}
      value={value || ''}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      required={required}
      error={error}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  )
}

export default SubParameterInput