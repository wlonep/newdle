import {BaseModal} from './BaseModal'

type Props = {
    isOpen: boolean
    handleClose: () => void
}

export const AboutModal = ({isOpen, handleClose}: Props) => {
    return (
        <BaseModal title="이 게임은 뭔가요?" isOpen={isOpen} handleClose={handleClose}>
            <p className="text-base text-gray-700 mt-3">
                <b>“뉴들”</b>은&nbsp;
                <a href="https://kordle.kr/" target="_blank"
                   className="text-stone-700 underline underline-offset-2 hover:text-blue-700">
                    꼬들
                </a>
                &nbsp;프로젝트에서 모티브를 얻어 제작된<br/>
                한글 낱자 기반 단어 맞히기 게임으로,<br/>
                <a href="https://github.com/roedoejet/AnyLanguage-Word-Guessing-Game" target="_blank"
                   className="text-stone-700 underline underline-offset-2 hover:text-blue-700">
                    Aidan Pine의 오픈소스 포크
                </a>
                를 기반으로 제작되었습니다.<br/>
                <br/>
                <a href="https://github.com/wlonep/newdle" target="_blank"
                   className="text-stone-700 underline underline-offset-2 hover:text-blue-700">GitHub 저장소
                </a>
                에서 소스코드를 확인하거나,<br/>
                <a href="https://blog.wlonep.com/" target="_blank"
                   className="text-stone-700 underline underline-offset-2 hover:text-blue-700">
                    개발자 블로그
                </a>
                를 통해 개발 과정을 확인해 보세요!<br/>
                <br/>
                뉴들에 사용된 단어는&nbsp;
                <a href="https://stdict.korean.go.kr/main/main.do" target="_blank"
                   className="text-stone-700 underline underline-offset-2 hover:text-blue-700">
                    표준국어대사전
                </a>
                에서 발췌했습니다.<br/>
                문의사항이나 의견은&nbsp;
                <a href="mailto:frin0911@konkuk.ac.kr" target="_blank"
                   className="text-stone-700 underline underline-offset-2 hover:text-blue-700">
                    메일
                </a>로 보내주세요.
            </p>
        </BaseModal>
    )
}
