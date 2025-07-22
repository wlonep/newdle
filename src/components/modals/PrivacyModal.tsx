import {BaseModal} from "./BaseModal";

type Props = {
    isOpen: boolean
    handleClose: () => void
    handleAgree: () => void
}

export const PrivacyModal = ({isOpen, handleClose, handleAgree}: Props) => {
    return (
        <BaseModal title="개인정보처리방침" isOpen={isOpen} handleClose={handleClose}>
            <hr/>
            <div className="w-full mx-auto p-2 text-gray-800 text-left">
                <p>본 방침은 <strong>뉴들</strong>(이하 ‘서비스’)가 이용자의 개인정보를 보호하고 관련 법령을 준수하기 위해
                    수립된 기준입니다.<br/>본 방침은 2025년 7월 1일부터 적용됩니다.</p>

                <h2 className="text-xl font-semibold mt-5 mb-2">1. 수집하는 개인정보 항목</h2>
                <ul className="list-disc list-inside space-y-1 ">
                    <li>접속기록(IP 주소, 고유 식별자 등)</li>
                    <li>부정행위 및 비정상 이용기록(IP 주소 등)</li>
                </ul>

                <h2 className="text-xl font-semibold mt-5 mb-2">2. 개인정보의 수집 및 이용 목적</h2>
                <ul className="list-disc list-inside space-y-1 ">
                    <li>접속 이력 관리 및 보안 로그 분석</li>
                    <li>악의적인 접근 차단 및 부정행위 방지</li>
                    <li>서비스 품질 개선 및 안정적인 운영</li>
                </ul>

                <h2 className="text-xl font-semibold mt-5 mb-2">3. 개인정보 보유 및 이용 기간</h2>
                <table className="table-auto w-full border border-gray-300 text-sm ">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">수집 정보</th>
                        <th className="border px-4 py-2 text-left">이용 목적</th>
                        <th className="border px-4 py-2 text-left">보유 기간</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border px-4 py-2">접속기록</td>
                        <td className="border px-4 py-2">보안 로그 분석 및 품질 개선</td>
                        <td className="border px-4 py-2">6개월</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">부정행위 IP</td>
                        <td className="border px-4 py-2">비정상 행위 차단 및 재발 방지</td>
                        <td className="border px-4 py-2">3년</td>
                    </tr>
                    </tbody>
                </table>

                <h2 className="text-xl font-semibold mt-5 mb-2">4. 제3자 제공 및 위탁</h2>
                <p>본 서비스는 개인정보를 외부에 제공하거나 처리 위탁하지 않습니다. 단, 법령에 따른 경우는 예외로 합니다.</p>

                <h2 className="text-xl font-semibold mt-5 mb-2">5. 이용자 권리 및 행사 방법</h2>
                <p>이용자는 언제든지 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 다만, 시스템 보안상 IP
                    주소 등의 로그 정보는 직접 열람·정정이 제한될 수 있습니다.</p>

                <h2 className="text-xl font-semibold mt-5 mb-2">6. 개인정보 파기 절차 및 방법</h2>
                <p>개인정보는 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기됩니다. 파기 절차 및 방법은
                    다음과 같습니다.</p>
                <ul className="list-disc list-inside space-y-1 ">
                    <li>전자적 파일: 복구 불가능한 방식으로 영구 삭제</li>
                    <li>출력물 등: 분쇄하거나 소각</li>
                </ul>

                <h2 className="text-xl font-semibold mt-5 mb-2">7. 개인정보 보호를 위한 조치</h2>
                <p>본 서비스는 개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다.</p>
                <ul className="list-disc list-inside space-y-1 ">
                    <li>접근 권한 최소화 및 통제</li>
                    <li>로그 기록에 대한 접근 제한</li>
                </ul>

                <h2 className="text-xl font-semibold mt-5 mb-2">8. 개인정보 보호책임자</h2>
                <p className="mb-1">책임자: 서비스 운영자</p>
                <p>이메일: <a href="mailto:frin0911@konkuk.ac.kr" className="text-blue-600 underline">
                    frin0911@konkuk.ac.kr
                </a></p>

                <h2 className="text-xl font-semibold mt-5 mb-2">9. 방침 변경 고지</h2>
                <p>본 방침은 2025년 7월 1일부터 적용되며, 내용이 변경될 경우 웹사이트 공지사항을 통해 안내합니다.</p>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleAgree}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                    >
                        위 내용에 동의합니다
                    </button>
                </div>
            </div>

        </BaseModal>
    )
}