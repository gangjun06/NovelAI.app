import { MainTemplate } from '~/components/template'

const NewImage = () => {
  return (
    <MainTemplate
      title="이미지 업로드"
      description="갤러리에 이미지를 업로드합니다"
      container
      pageBack={{ label: '갤러리', to: '/gallery' }}
      tiny
    >
      <div></div>
    </MainTemplate>
  )
}

export default NewImage
