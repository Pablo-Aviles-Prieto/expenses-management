import { FormikErrors } from 'formik'

type BtnDisabledI<T> = {
  isSubmitting: boolean
  errorsObj: FormikErrors<T>
  debouncedPasswordError?: string
}

export const formikBtnIsDisabled = <T>({ isSubmitting, errorsObj, debouncedPasswordError }: BtnDisabledI<T>) => {
  return isSubmitting || Object.keys(errorsObj).length > 0 || !!debouncedPasswordError
}
