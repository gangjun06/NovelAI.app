import { NextPage } from "next";
import dynamic from "next/dynamic";
import { AvatarCard } from "~/components/molecule";
import { MainTemplate } from "~/components/template";

const About: NextPage = () => {
  return (
    <MainTemplate
      title="정보"
      description="NovelAI APP과 관련된 정보 페이지입니다."
    >
      <h1 className="text-center text-4xl font-bold pt-8 text-title-color">
        NovelAI.APP 정보
      </h1>

      <main className="container mx-auto px-4 my-4 py-4 flex flex-col items-center justify-center text-base-color text-center">
        <div>
          <b>본 웹사이트는 Anlatan사의 NovelAI와 직접적인 관련이 없습니다.</b>
          <br />
          아직 개발 중이며 로드맵은{" "}
          <a href="https://github.com/gangjun06/NovelAI.app/issues/1">
            이곳
          </a>{" "}
          에서 보실 수 있습니다.
          <br />
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:me@gangjun.dev">문의</a>
            <a
              href="https://docs.google.com/spreadsheets/d/18CA__L4yQOs9xAQslP5FUvooD8i8Wz-D7yCnsIYqoBM/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              태그목록
            </a>
            <a
              href="https://github.com/gangjun06/NovelAI.app"
              target="_blank"
              rel="noreferrer"
            >
              소스코드(깃허브)
            </a>
            <a href="https://toss.me/gangjun" target="_blank" rel="noreferrer">
              개발자에게 커피 선물하기
            </a>
          </div>
        </div>
        <h2 className="text-2xl text-subtitle-color mt-4">개발/관리</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <AvatarCard
            name="Kangjun Lee"
            description="Developer"
            avatarURL="https://avatars.githubusercontent.com/u/50910815?v=4"
            buttonLink="https://github.com/gangjun06"
            buttonText="Github"
          />
          <AvatarCard
            name="AITag"
            description="Organize Tags"
            avatarURL=""
            buttonLink="https://arca.live/u/@AiTAG"
            buttonText="ArcaLive"
          />
          <AvatarCard
            name="Contributors"
            description="Other contributors on github"
            buttonLink="https://github.com/gangjun06/NovelAI.app/graphs/contributors"
            buttonText="Github Contributors"
          />
        </div>
      </main>
    </MainTemplate>
  );
};

export default About;
