import { NextPage } from 'next'

import { TagTool } from '../organizm/TagTool/TagTool'
import { MainTemplate } from '../template'

export const Home: NextPage = () => {
  return (
    <MainTemplate title="태그생성기" description="NovelAI 태그 생성기">
      <TagTool />
    </MainTemplate>
  )
}
