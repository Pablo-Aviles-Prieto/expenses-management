import * as Yup from 'yup'

interface ParentType {
  mainDate?: string
}

export const AddSchema = Yup.object().shape({
  name: Yup.string().required('Provide a name for the transaction'),
  amount: Yup.number()
    .required('Provide an amount for the transaction')
    .test('non-zero', 'Provide a different amount than 0', value => value !== 0),
  mainDate: Yup.string().required('Provide a date for the transaction'),
  recurrent: Yup.boolean().test(
    'date-picker-required',
    'Date is required when recurrent transaction is enabled',
    function (value) {
      const { mainDate } = this.parent as ParentType
      return !(value && !mainDate)
    }
  )
  // categories: Yup.object().shape({

  // })
})
