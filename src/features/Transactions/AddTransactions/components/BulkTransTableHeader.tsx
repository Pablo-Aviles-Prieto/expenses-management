import Dropdown from '@/components/Dropdown'
import { FormBtn } from '@/components/Form'
import { Info } from '@/components/icons'
import { FC } from 'react'

type Props = {
  CSVDateFormat: string
  datesCSVFormatOptions: string[]
  isLoading: boolean
  isDisabled: boolean
  handleCSVDateFormat: (value: string | string[]) => void
}

export const BulkTransTableHeader: FC<Props> = ({
  datesCSVFormatOptions,
  CSVDateFormat,
  isLoading,
  isDisabled,
  handleCSVDateFormat
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-end gap-2">
        <h4 className="text-lg font-bold">Transaction list</h4>
        <button
          type="button"
          onClick={() =>
            console.log('Show a tooltip with info of how to work with the CSV on hover')
          }
        >
          <Info width={25} height={25} />
        </button>
      </div>
      <div className="mt-auto">
        <FormBtn isLoading={isLoading} isDisabled={isDisabled}>
          Upload the transactions
        </FormBtn>
      </div>
      <div>
        <p className="text-xs">Select the format date on your CSV</p>
        <Dropdown
          dropdownOptions={datesCSVFormatOptions}
          onChange={handleCSVDateFormat}
          value={CSVDateFormat}
        />
      </div>
    </div>
  )
}
