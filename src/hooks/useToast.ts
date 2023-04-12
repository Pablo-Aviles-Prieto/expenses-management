import { ToastContent, ToastOptions, UpdateOptions, toast } from 'react-toastify'

interface IToast {
  content?: ToastContent<JSX.Element>
  msg?: string
  options?: ToastOptions
}

interface IPromiseToast<DataType> {
  promiseFn: Promise<DataType>
  onPending: string
  onSuccess?: UpdateOptions<DataType>
  onError?: UpdateOptions<unknown>
}

export const useToast = () => {
  const showToast = ({ content, msg = '', options = {} }: IToast) => {
    const defaultOptions: ToastOptions = {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      type: 'default'
    }
    toast(msg || content, { ...defaultOptions, ...options })
  }

  const promiseToast = async <T>({ promiseFn, onPending, onSuccess, onError }: IPromiseToast<T>) => {
    await toast.promise(promiseFn, {
      pending: onPending,
      success: onSuccess,
      error: onError
    })
  }

  return { showToast, promiseToast }
}
