import { FormikErrors } from 'formik'

export type IFormikBtnDisabled<T> = {
  isSubmitting: boolean
  errorsObj: FormikErrors<T>
  externalError?: string | boolean
}
