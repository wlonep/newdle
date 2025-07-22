import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faChartSimple,
  faCircleQuestion,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { SideMenu } from './components/menu/SideMenu'
import { Route, Routes, useLocation } from 'react-router-dom'
import Main from './pages/Main'
import Custom from './pages/Custom'
import Code from './pages/Code'
import { List } from './pages/List'
import { Id } from './pages/Id'
import { AdminLoginModal } from './components/modals/AdminLoginModal'
import { Panel } from './pages/Panel'
import { NotFound } from './pages/NotFound'

const App: React.FC = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [failMessage, setFailMessage] = useState<string | null>(null)
  const [loginModal, setLoginModal] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [title, setTitle] = useState('뉴들')

  const props = {
    isInfoModalOpen,
    isStatsModalOpen,
    setIsInfoModalOpen,
    setIsStatsModalOpen,
    failMessage,
    setFailMessage,
    setTitle,
  }

  useEffect(() => {
    setFailMessage(null)
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('side-menu')
      const btn = document.getElementById('menu-btn')

      if (!menu || !isMenuOpen || !btn) return

      const target = e.target as HTMLElement
      if (!menu.contains(target) && !btn.contains(target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // const TRACKING_ID = CONFIG.googleAnalytics
  //
  // if (TRACKING_ID && process.env.NODE_ENV !== 'test') {
  //     ReactGA.initialize(TRACKING_ID)
  //     ReactGA.send({hitType: 'pageview', page: window.location.pathname})
  // }

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10 h-16">
        <div className="relative max-w-full mx-auto h-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <div
              className="relative w-6 h-6 cursor-pointer"
              id="menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon
                icon={faBars}
                className={`text-2xl absolute inset-0 transition-all duration-200 transform 
                                ${
                                  isMenuOpen
                                    ? 'opacity-0 scale-90 rotate-90'
                                    : 'opacity-100 scale-100 rotate-0'
                                }`}
              />
              <FontAwesomeIcon
                icon={faXmark}
                className={`text-2xl absolute inset-0 transition-all duration-200 transform 
                                ${
                                  isMenuOpen
                                    ? 'opacity-100 scale-100 rotate-0'
                                    : 'opacity-0 scale-90 rotate-90'
                                }`}
              />
            </div>
          </div>

          <h1
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[50%]"
          >
            {title}
          </h1>

          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-4">
            {['', 'long', 'short'].includes(
              location.pathname.replace('/', '')
            ) ? (
              <div className="flex gap-2">
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="text-2xl"
                  onClick={() => setIsInfoModalOpen(true)}
                />
                <FontAwesomeIcon
                  icon={faChartSimple}
                  className="text-2xl"
                  onClick={() => setIsStatsModalOpen(true)}
                />
              </div>
            ) : null}
            {location.pathname.replace('/', '').includes('custom/code') ||
            location.pathname.replace('/', '').includes('custom/id') ? (
              <div className="flex gap-2">
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="text-2xl"
                  onClick={() => setIsInfoModalOpen(true)}
                />
              </div>
            ) : null}
          </div>
        </div>
        <SideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          setLoginModal={setLoginModal}
        />
      </header>
      <div className="pt-16"></div>

      <Routes>
        <Route path="/" element={<Main key="normal" {...props} />} />
        <Route path="/short" element={<Main key="short" {...props} />} />
        <Route path="/long" element={<Main key="long" {...props} />} />
        <Route path="/custom/new" element={<Custom {...props} />} />
        <Route path="/custom/code/:encoded" element={<Code {...props} />} />
        <Route path="/custom/list" element={<List {...props} />} />
        <Route path="/custom/id/:id" element={<Id {...props} />} />
        <Route
          path="/panel"
          element={
            <Panel
              setTitle={setTitle}
              failMessage={failMessage}
              setFailMessage={setFailMessage}
              setLoginModal={setLoginModal}
              loginSucess={loginSuccess}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AdminLoginModal
        isOpen={loginModal}
        onClose={() => setLoginModal(false)}
        setFailMessage={setFailMessage}
        onSucess={() => setLoginSuccess(true)}
      />
    </div>
  )
}

export default App
