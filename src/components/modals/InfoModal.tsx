import {Cell} from '../grid/Cell'
import {BaseModal} from './BaseModal'

type Props = {
    isOpen: boolean
    handleClose: () => void
}

interface Letter {
    letter: string
    highlight: boolean
}

export const InfoModal = ({isOpen, handleClose}: Props) => {
    const firstExampleWord: Letter[] = [
        {
            "letter": "ㄱ",
            "highlight": true
        },
        {
            "letter": "ㅏ",
            "highlight": false
        },
        {
            "letter": "ㅣ",
            "highlight": false
        },
        {
            "letter": "ㅂ",
            "highlight": false
        },
        {
            "letter": "ㅜ",
            "highlight": false
        },
        {
            "letter": "ㄹ",
            "highlight": false
        }
    ]
    const secondExampleWord: Letter[] = [
        {
            "letter": "ㅈ",
            "highlight": false
        },
        {
            "letter": "ㅗ",
            "highlight": false
        },
        {
            "letter": "ㄱ",
            "highlight": false
        },
        {
            "letter": "ㅂ",
            "highlight": true
        },
        {
            "letter": "ㅏ",
            "highlight": false
        },
        {
            "letter": "ㄹ",
            "highlight": false
        }
    ]
    const thirdExampleWord: Letter[] = [
        {
            "letter": "ㅂ",
            "highlight": false
        },
        {
            "letter": "ㅏ",
            "highlight": true
        },
        {
            "letter": "ㄹ",
            "highlight": false
        },
        {
            "letter": "ㅅ",
            "highlight": false
        },
        {
            "letter": "ㅓ",
            "highlight": false
        },
        {
            "letter": "ㅇ",
            "highlight": false
        }
    ]
    return (
        <BaseModal title="튜토리얼" isOpen={isOpen} handleClose={handleClose}>
            <hr/>
            <br/>
            <p className="text-base text-gray-500">
                여러 개의 자모로 된 단어를 제한된 도전 횟수 안에 맞혀보세요.<br/>
                단어를 작성한 뒤 <b>입력</b>을 누르면 각 자모는 <br/>
                다음과 같은 세 가지 상태로 표시됩니다.<br/>
            </p>
            <hr/>
            <br/>
            <h3 className="text-lg leading-6 font-medium text-gray-900">1. 맞는 자모</h3>
            <div className="flex justify-center mb-1 mt-4">
                {Array.isArray(firstExampleWord) &&
                    firstExampleWord.map((el: Letter) => {
                        if (el.highlight) {
                            return <Cell wordLength={6} key={el.letter} value={el.letter} status="correct"/>
                        } else {
                            return <Cell wordLength={6} key={el.letter} value={el.letter}/>
                        }
                    })}
            </div>
            <br/>
            <p className="text-base text-gray-500">
                <b>맞는 자모</b>는 초록색으로 표시됩니다.<br/>
                위의 예시에서 <b>ㄱ</b>은 올바른 자리에 있습니다.
            </p>
            <hr/>
            <br/>
            <h3 className="text-lg leading-6 font-medium text-gray-900">2. 정답에 포함된 자모</h3>
            <div className="flex justify-center mb-1 mt-4">
                {Array.isArray(secondExampleWord) &&
                    secondExampleWord.map((el) => {
                        if (el.highlight) {
                            return <Cell wordLength={6} key={el.letter} value={el.letter} status="present"/>
                        } else {
                            return <Cell wordLength={6} key={el.letter} value={el.letter}/>
                        }
                    })}
            </div>
            <p className="text-base text-gray-500">
                <b>정답에 포함된 단어</b>는 노란색으로 표시됩니다.<br/>
                위의 예시에서 <b>ㅂ</b>은 정답 단어에 포함되지만<br/>
                잘못된 자리에 있습니다.
            </p>
            <hr/>
            <br/>
            <h3 className="text-lg leading-6 font-medium text-gray-900">3. 틀린 자모</h3>
            <div className="flex justify-center mb-1 mt-4">
                {Array.isArray(thirdExampleWord) &&
                    thirdExampleWord.map((el) => {
                        if (el.highlight) {
                            return <Cell wordLength={6} key={el.letter} value={el.letter} status="absent"/>
                        } else {
                            return <Cell wordLength={6} key={el.letter} value={el.letter}/>
                        }
                    })}
            </div>
            <p className="text-base text-gray-500">
                <b>틀린 자모</b>는 회색으로 표시됩니다.<br/>
                위의 예시에서 <b>ㅏ</b>는 정답 단어에 포함되지 않습니다.
            </p>
            <br/>
        </BaseModal>
    )
}
