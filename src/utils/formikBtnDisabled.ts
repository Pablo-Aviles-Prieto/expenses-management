import type { IFormikBtnDisabled } from '@/interfaces'

export const formikBtnIsDisabled = <T>({ isSubmitting, errorsObj, externalError }: IFormikBtnDisabled<T>) => {
  return isSubmitting || Object.keys(errorsObj).length > 0 || !!externalError
}
