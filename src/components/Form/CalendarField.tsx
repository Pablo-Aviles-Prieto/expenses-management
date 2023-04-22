// /* eslint-disable max-len */
// import { Field, useField } from 'formik'
// import { useEffect } from 'react'
// import { useDebounce } from '@/hooks'
// import * as Yup from 'yup'

// interface DebouncedFieldTextProps<T> {
//   label: string
//   id: string
//   name: string
//   type: string
//   placeholder: string
//   errorMsg: string | undefined
//   setErrorMsg: React.Dispatch<React.SetStateAction<DebouncedFieldTextProps<string>['errorMsg']>>
//   validationSchema: Yup.Schema<T>
// }

// export const DebouncedFieldText = <T,>({
//   label,
//   validationSchema,
//   errorMsg,
//   setErrorMsg,
//   ...props
// }: DebouncedFieldTextProps<T>) => {
//   const [field, meta, helpers] = useField<string>(props)
//   const debouncedValue = useDebounce<string>(field.value, 500)

//   useEffect(() => {
//     if (debouncedValue || meta.touched) {
//       helpers.setTouched(true)
//       validationSchema
//         .validate(debouncedValue)
//         .then(() => setErrorMsg(undefined))
//         .catch((err: Yup.ValidationError) => setErrorMsg(err.message))
//     }
//   }, [debouncedValue, validationSchema, setErrorMsg, meta.touched])

//   const errorClass = meta.touched && errorMsg ? 'border-red-500 border-2' : ''

//   return (
//     <div className="mb-2">
//       <label className="block mb-2 text-sm font-bold text-gray-200" htmlFor={props.id}>
//         {label}
//       </label>
//       <Field
//         {...field}
//         {...props}
//         className={`w-full px-3 py-2 leading-tight text-gray-600 bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errorClass}`}
//       />
//       <p className="min-h-[25px] text-red-500">{errorMsg}</p>
//     </div>
//   )
// }
