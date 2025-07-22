import React, {useCallback, useEffect, useState} from 'react'
import {API_URL} from '../constants/config'
import {Loading} from "../components/alerts/Loading";
import {setFailAlert} from "../lib/game";
import {Alert} from "../components/alerts/Alert";
import {AdminToday} from "../components/menu/AdminToday";
import {AdminCustom} from "../components/menu/AdminCustom";
import {AdminLog} from "../components/menu/AdminLog";

type Props = {
    setTitle: (title: string) => void
    failMessage: string | null
    setFailMessage: (message: string | null) => void
    setLoginModal: (open: boolean) => void
    loginSucess: boolean
}

export const Panel = ({setTitle, failMessage, setFailMessage, setLoginModal, loginSucess}: Props) => {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [auditReloadFlag, setAuditReloadFlag] = useState(0);

    const checkAuth = useCallback(async () => {
        const res = await fetch(`${API_URL}/admin/me`, {
            credentials: 'include',
        })
        if (!res.ok) {
            setFailAlert(setFailMessage, '로그인 정보가 유효하지 않습니다.\n다시 로그인해 주세요.')
            setIsLoggedIn(false)
            setLoginModal(true)
            return
        }
        setIsLoggedIn(true)
        setIsCheckingAuth(false)
    }, [setLoginModal, setFailMessage])

    useEffect(() => {
        setTitle('관리 패널')
        checkAuth().catch(console.error)
    }, [checkAuth, setTitle])

    useEffect(() => {
        if (loginSucess) {
            checkAuth().catch(console.error)
        }
    }, [loginSucess, checkAuth])

    const reloadAuditLog = () => setAuditReloadFlag(f => f + 1);

    if (isCheckingAuth) return <Loading/>

    if (!isLoggedIn) return null
    return (
        <>
            <AdminToday/>
            <AdminCustom setSuccessMessage={setSuccessMessage} onAction={reloadAuditLog}/>
            <AdminLog reloadFlag={auditReloadFlag}/>
            <Alert message={successMessage} isOpen={successMessage !== ''} variant="success"/>
            <Alert message={failMessage ?? ''} isOpen={!!failMessage}/>
        </>
    )
}
