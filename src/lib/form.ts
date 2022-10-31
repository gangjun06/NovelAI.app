import { z } from 'zod'

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === 'string') {
        return { message: '문자를 입력해 주세요' }
      } else if (issue.expected === 'number') {
        return { message: '숫자를 입력해 주세요' }
      }
      return { message: '잘못된 형식이 입력되었어요' }
    case z.ZodIssueCode.too_small:
      if (issue.type === 'array')
        return { message: `적어도 ${issue.minimum}개의 항목을 추가해주세요` }
      return { message: `${issue.minimum}글자 이상 입력해주세요` }
    case z.ZodIssueCode.too_big:
      if (issue.type === 'array')
        return { message: `최대 ${issue.maximum}개의 항목까지만 사용할 수 있어요` }
      return { message: `${issue.maximum}글자 이하로 입력해주세요` }
    // case z.ZodIssueCode.
  }
  // if (issue.code === z.ZodIssueCode.invalid_type) {
  //   if (issue.expected === 'string') {
  //     return { message: 'bad type!' }
  //   }
  // }

  if (issue.code === z.ZodIssueCode.custom) {
    return { message: `less-than-${(issue.params || {}).minimum}` }
  }
  return { message: ctx.defaultError }
}
