import {useEffect} from "react";
import {setFailAlert} from "./game";
import {API_URL} from "../constants/config";

export const useTutorialModal = (setIsInfoModalOpen: (isOpen: boolean) => void) => {
    useEffect(() => {
        if (!localStorage.getItem("tutorial-open")) {
            setIsInfoModalOpen(true);
            localStorage.setItem("tutorial-open", "true");
        }
    }, [setIsInfoModalOpen]);
}

export const ensureUUID = async (setFailMessage: (s: string | null) => void):
    Promise<string | null> => {
    let uuid = localStorage.getItem('uuid')
    if (!uuid) {
        const res = await fetch(`${API_URL}/user/register`,
            {
                method: 'POST'
            })

        if (res.status === 403) {
            setFailAlert(setFailMessage, '요청이 제한된 아이피입니다.')
            return null
        } else if (!res.ok) {
            setFailAlert(setFailMessage, '요청에 실패했습니다.')
            return null
        }

        const req = await res.json()
        localStorage.setItem('uuid', req.uuid)
        uuid = req.uuid
    }
    return uuid
}