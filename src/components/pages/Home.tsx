/* eslint-disable react/no-unknown-property */
import { NextPage } from 'next'

import { TagTool } from '../organizm/TagTool/TagTool'
import { MainTemplate } from '../template'

export const Home: NextPage = () => {
  return (
    <>
      <style global={true} jsx={true}>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>
      <MainTemplate title="태그생성기" description="NovelAI 태그 생성기">
        <TagTool />
      </MainTemplate>
    </>
  )
}
