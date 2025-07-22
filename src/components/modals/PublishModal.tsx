import {BaseModal} from "./BaseModal";
import {Cell} from "../grid/Cell";

type Props = {
    isOpen: boolean
    handleClose: () => void
    handleAgree: () => void
    author: string[]
    problem: string[]
    wordLength: number
}

export const PublishModal = ({isOpen, handleClose, handleAgree, author, problem, wordLength}: Props) => {
    return (
        <BaseModal title="문제 등록" isOpen={isOpen} handleClose={handleClose}>
            <hr/>
            <div className="w-full mx-auto p-2 text-gray-800 text-left">
                <h2 className="text-center text-xl font-bold">제작자</h2>
                <div className="flex justify-center mb-4 mt-1">
                    {author.map((a, i) => {
                        return <Cell wordLength={wordLength} key={i} value={a} status="absent"/>
                    })}
                </div>
                <h2 className="text-center text-xl font-bold">문제</h2>
                <div className="flex justify-center mb-4 mt-1">
                    {problem.map((a, i) => {
                        return <Cell wordLength={wordLength} key={i} value={a} status="correct"/>
                    })}
                </div>
                <hr/>
                <p className="text-lg font-bold mt-4 mb-1 text-red-600">한 번 등록한 문제는 수정 및 삭제가 불가능합니다.</p>
                <p className="text-base mt-1 mb-4 text-gray-500">※ 음란물, 욕설, 혐오 표현 등 부적절한 단어 및 개인정보
                    입력 시 게시가 제한되거나 삭제될 수 있습니다.</p>
                <hr/>
                <p className="text-base mt-5 mb-1 text-center">위 내용을 확인했다면 아래의 버튼을 눌러주세요.</p>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleAgree}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                    >
                        문제 등록하기
                    </button>
                </div>
            </div>
        </BaseModal>
    )
}