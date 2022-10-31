// /* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentProps,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
} from 'react'
import {
  Controller,
  DeepPartial,
  FieldErrorsImpl,
  FieldPath,
  FieldValues,
  FormProvider,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useFormContext,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import classNames from 'classnames'
import superjson from 'superjson'
import useSWR, { mutate } from 'swr'
import { z } from 'zod'

import { fetcher } from '~/utils/api'

export const formatError = <FormValues extends FieldValues>(
  error: FieldErrorsImpl<FormValues>,
  name: keyof FormValues,
  customName?: string,
): string => {
  const err = error[name]
  if (!err) return ''
  const label = customName ?? (name as string)
  switch (err.type) {
    case 'required':
      return `${label}은 필수입니다.`
    default:
      return err.type as string
  }
}

type UseFormRegisterOption<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = RegisterOptions<TFieldValues, TFieldName> &
  Partial<{
    customLabel?: string
  }>

export declare type UseFormRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  name: TFieldName,
  options?: UseFormRegisterOption<TFieldValues, TFieldName>,
) => UseFormRegisterReturn<TFieldName> & {
  error?: string
  required?: boolean
}

type FormProps<TSchema extends z.ZodType<any, any>> = {
  onSubmit?: SubmitHandler<z.infer<TSchema>>
  onInvalid?: SubmitErrorHandler<z.TypeOf<TSchema>>
  children: (
    methods: UseFormReturn<z.infer<TSchema>> & {
      registerForm: UseFormRegister<z.infer<TSchema>>
    },
  ) => React.ReactNode
  url?: string
  method?: string
  onSuccess?: () => void
  schema?: TSchema
  getInitialValues?: boolean
  initialValues?: DeepPartial<z.TypeOf<TSchema>>
}

export const Form = <TSchema extends z.ZodType<any, any, any>>({
  onSubmit,
  children,
  method = 'POST',
  url,
  onSuccess,
  schema,
  getInitialValues = false,
  onInvalid,
  initialValues,
}: FormProps<TSchema>) => {
  const resultURL = getInitialValues ? url : null

  const { data, error } = useSWR(resultURL, fetcher)
  const methods = useForm<z.infer<TSchema>>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: data ?? initialValues,
  })

  useEffect(() => {
    if (!error && data) {
      methods.reset(data)
    }
  }, [error, data, methods])

  const { errors } = methods.formState
  const registerFormValue = useCallback(
    (name: string, options: UseFormRegisterOption<z.infer<TSchema>, any>) => {
      return {
        required: !!options?.required,
        error: (errors[name]?.message as string) ?? '',
      }
    },
    [errors],
  )

  const registerForm: UseFormRegister<z.infer<TSchema>> = (name, options) => {
    return {
      ...methods.register(name, options),
      ...registerFormValue(name, options as any),
    }
  }

  const onSubmitRequest = async (data: z.infer<TSchema>) => {
    let toastId
    if (typeof onSuccess !== 'function') toastId = toast.loading('요청을 전송 중입니다')
    try {
      const res = await fetch(url!, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...(data ? { body: superjson.stringify(data) } : {}),
        method,
      })
      if (res.status > 210) throw new Error('Error')

      if (typeof onSuccess === 'function') onSuccess()
      else {
        toast.success('성공적으로 전송되었습니다.', { id: toastId })
      }
      methods.reset({ ...data })
      mutate({ ...data })
    } catch (e) {
      toast.error('요청중 에러가 발생하였습니다.', { id: toastId })
      console.error(e)
    }
  }

  if (!url && !onSubmit) {
    throw new Error('onSubmit or url should be provided')
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={
          url ? methods.handleSubmit(onSubmitRequest) : methods.handleSubmit(onSubmit!, onInvalid)
        }
        className="flex flex-col gap-y-3"
        onInvalid={(e) => {
          console.log(e)
          console.log('!!!')
        }}
      >
        {!resultURL || data || error ? children({ ...methods, registerForm }) : 'Loading'}
      </form>
    </FormProvider>
  )
}

export type ControllerRender = Parameters<ComponentProps<typeof Controller>['render']>[0]

export type FormFieldProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  ComponentProps<T> & {
    name: string
  }

interface FormFieldBuilderProps {
  name: string
  children: (data: ControllerRender & { error?: string }) => ReactElement
}

export const FormFieldBuilder = ({ name, children }: FormFieldBuilderProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const error = formatError(errors, name)

  return (
    <Controller
      name={name}
      control={control}
      render={(props) => <>{children({ ...props, error })}</>}
    />
  )
}
