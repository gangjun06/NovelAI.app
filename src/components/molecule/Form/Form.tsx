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
import { z, ZodEffects, ZodNumber, ZodObject, ZodOptional, ZodString } from 'zod'

import { fetcher } from '~/utils/api'

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
    mode: 'onChange',
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
    let target = schema?._def

    const inputProps: React.PropsWithoutRef<JSX.IntrinsicElements['input']> = {}

    if (schema instanceof ZodEffects && schema._def.schema instanceof ZodObject)
      target = schema._def.schema.shape[name]
    else if (schema instanceof ZodObject) target = schema.shape[name]
    else target = null

    if (target) {
      if (target instanceof ZodOptional) {
        target = target._def.innerType
      }
      if (target instanceof ZodNumber || target instanceof ZodString) {
        target._def.checks.forEach((data) => {
          if (data.kind === 'email') {
            inputProps.type = 'email'
          } else if (data.kind === 'max') {
            inputProps.max = data.value
            inputProps.maxLength = data.value
          } else if (data.kind === 'min') {
            inputProps.min = data.value
            inputProps.minLength = data.value
          }
        })
      }
    }

    return {
      ...inputProps,
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
        ...(data ? { body: JSON.stringify(data) } : {}),
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
