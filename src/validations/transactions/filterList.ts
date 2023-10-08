import * as Yup from 'yup'

export const FilterListSchema = Yup.object().shape({
  filterNameOrValue: Yup.string(),
  filterBy: Yup.string().required('Provide a method to filter'),
  categories: Yup.array()
})
