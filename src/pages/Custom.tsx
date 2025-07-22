import React, {useEffect, useState} from 'react'
import {SingleRowInput} from "../components/grid/SingleRowInput";
import {Alert} from "../components/alerts/Alert";
import {Keyboard} from "../components/keyboard/Keyboard";
import {compressToEncodedURIComponent} from 'lz-string';
import {PrivacyModal} from "../components/modals/PrivacyModal";
import {PublishModal} from "../components/modals/PublishModal";
import {useNavigate} from "react-router-dom";
import {setFailAlert} from "../lib/game";
import {PageProps} from "../constants/types";
import {ALERT_TIME_MS, API_URL} from "../constants/config";
import {createInputMap} from "../lib/keyboard";
import {ensureUUID} from "../lib/hooks";

const MAX_LENGTH = 15

const Custom = ({failMessage, setFailMessage, setTitle}: PageProps) => {
    const navigate = useNavigate()

    const [copy, setCopy] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false)
    const [isPublishModalOpen, setPublishModalOpen] = useState(false)

    const [authorLength, setAuthorLength] = useState(5)
    const [author, setAuthor] = useState<Array<string>>([])
    const [isAuthorCompleted, setAuthorCompleted] = useState(false)

    const [problemLength, setProblemLength] = useState(5)
    const [problem, setProblem] = useState<Array<string>>([])
    const [isProblemCompleted, setProblemCompleted] = useState(false)

    const [isPublic, setPublic] = useState(true)

    useEffect(() => setTitle("나만의 뉴들"), [setTitle])

    const authorEvent = createInputMap(
        author, setAuthor,
        MAX_LENGTH, authorLength, setAuthorLength,
        isAuthorCompleted, setAuthorCompleted, setFailMessage
    )

    const problemEvent = createInputMap(
        problem, setProblem,
        MAX_LENGTH, problemLength, setProblemLength,
        isProblemCompleted, setProblemCompleted, setFailMessage
    )

    const togglePublic = () => {
        setPublic(!isPublic)
    }

    const savePrivate = () => {
        const data = {
            author: author.join(""),
            problem: problem.join("")
        }
        const compressed = compressToEncodedURIComponent(JSON.stringify(data))
        navigator.clipboard.writeText(`https://newdle.kr/custom/code/${compressed}`).catch(console.error)
        setCopy(true)
        setTimeout(() => setCopy(false), ALERT_TIME_MS)
    }

    const savePublic = async () => {
        setPublishModalOpen(false)

        const uuid = await ensureUUID(setFailMessage)
        if (!uuid) return

        const body = JSON.stringify({
            author: author.join(''),
            problem: problem.join(""),
            uuid: uuid
        })

        const res = await fetch(`${API_URL}/custom/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body,
        })

        if (res.status === 400)
            return setFailAlert(setFailMessage, "이미 존재하는 단어입니다.\n다른 문제를 만들어 보세요!")
        else if (res.status === 403)
            return setFailAlert(setFailMessage, '문제 등록이 제한된 사용자 또는 아이피입니다.')
        else if (!res.ok)
            return setFailAlert(setFailMessage, '문제 등록에 실패했습니다.\n잠시 후 다시 시도해 주세요.')

        setSuccess(true)
        setTimeout(() => {
            setSuccess(false)
            navigate('/custom/list')
        }, ALERT_TIME_MS / 2)

    }

    const active = !isAuthorCompleted ? authorEvent : problemEvent
    return (
        <>
            <div className="text-center">
                <p className="text-gray-600 px-2">나만의 단어를 만들어 다른 사람과 함께 풀어보세요.</p>
                <p className="mt-1 text-sm text-red-500 px-2">
                    ※ 음란물, 욕설, 혐오 표현 등 부적절한 단어 및 개인정보 입력 시 게시가 제한되거나 삭제될 수 있습니다.
                </p>
                <h3 className="mt-3 mb-1 text-2xl font-bold">제작자</h3>
                <SingleRowInput wordLength={authorLength} value={author} statuses={isAuthorCompleted}/>

                <h3 className="mt-6 mb-1 text-2xl font-bold">문제</h3>
                <SingleRowInput wordLength={problemLength} value={problem} statuses={isProblemCompleted}/>

                <h3 className="text-2xl mt-6 mb-1 font-bold">공개 범위</h3>
                <div className="flex items-center justify-center gap-4">
                    <div className="relative group" onClick={() => setPublic(false)}>
                        <h4 className={`text-lg underline decoration-dotted cursor-help 
                        ${isPublic ? "text-gray-500" : "text-black"}`}>
                            비공개
                        </h4>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs
                        bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100
                        transition-opacity duration-200 pointer-events-none z-10">
                            링크가 있는 사용자만 이 문제를 풀 수 있습니다.
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isPublic} onChange={togglePublic}/>
                        <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2
                            peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all
                            duration-200"></div>
                        <div
                            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200
                            peer-checked:translate-x-full"></div>
                    </label>
                    <div className="relative group" onClick={() => setPublic(true)}>
                        <h4 className={`text-lg underline decoration-dotted cursor-help 
                        ${isPublic ? "text-black" : "text-gray-500"}`}>
                            공개
                        </h4>
                        <div
                            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-800
                            text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity
                            duration-200 pointer-events-none z-10">
                            누구나 이 문제를 풀 수 있습니다.
                        </div>
                    </div>
                </div>

                <button
                    onClick={isAuthorCompleted && isProblemCompleted ?
                        isPublic ? () => {
                            if (!localStorage.getItem("privacy-agreed")) {
                                setPrivacyModalOpen(true)
                                return
                            }
                            setPublishModalOpen(true)
                        } : savePrivate : undefined}
                    type="button"
                    className={`mt-5 mb-10 max-w-[320px] w-1/2 rounded-md border border-transparent shadow-sm px-4 py-2 
                    text-base font-medium text-white
                    ${isAuthorCompleted && isProblemCompleted ?
                        "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
                        "focus:ring-indigo-500"
                        : "bg-gray-400 cursor-not-allowed"}`}
                >
                    {isPublic ? "문제 등록" : "문제 주소 복사"}
                </button>

                <Keyboard {...active} />
            </div>

            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                handleClose={() => setPrivacyModalOpen(false)}
                handleAgree={() => {
                    localStorage.setItem("privacy-agreed", "true")
                    setPrivacyModalOpen(false)
                    setPublishModalOpen(true)
                }}
            />

            <PublishModal
                isOpen={isPublishModalOpen}
                handleClose={() => setPublishModalOpen(false)}
                handleAgree={savePublic}
                author={author}
                problem={problem}
                wordLength={Math.max(authorLength, problemLength)}
            />

            <Alert message="공유 URL이 클립보드에 복사되었습니다." isOpen={copy} variant="success"/>
            <Alert message="문제가 등록되었습니다." isOpen={success} variant="success"/>
            <Alert message={failMessage ?? ''} isOpen={!!failMessage}/>
        </>
    )
}

export default Custom