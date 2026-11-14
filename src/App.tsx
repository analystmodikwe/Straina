import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { DemoNotice } from './components/DemoNotice'
import { OfflineBanner } from './components/OfflineBanner'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
        <OfflineBanner />
        <DemoNotice />
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route
              path="/"
              element={<div className="p-8 text-center text-[#475569]">Home / Map (S1)</div>}
            />
            <Route
              path="/explore"
              element={<div className="p-8 text-center text-[#475569]">Map Exploration (S2)</div>}
            />
            <Route
              path="/areas/:areaCode"
              element={<div className="p-8 text-center text-[#475569]">Location Detail (S3)</div>}
            />
            <Route
              path="/about"
              element={<div className="p-8 text-center text-[#475569]">Data Sources & About (S4)</div>}
            />
            <Route
              path="/sign-in"
              element={<div className="p-8 text-center text-[#475569]">Sign In (S5)</div>}
            />
            <Route
              path="/records"
              element={<div className="p-8 text-center text-[#475569]">Records List (S7)</div>}
            />
            <Route
              path="/records/new"
              element={<div className="p-8 text-center text-[#475569]">Submit Record (S6)</div>}
            />
            <Route
              path="/records/:recordId/edit"
              element={<div className="p-8 text-center text-[#475569]">Edit Record (S6)</div>}
            />
            <Route
              path="/admin/users"
              element={<div className="p-8 text-center text-[#475569]">Manage Users (S8)</div>}
            />
            <Route
              path="/admin/sources"
              element={<div className="p-8 text-center text-[#475569]">Manage Sources (S9)</div>}
            />
            <Route
              path="/access-denied"
              element={<div className="p-8 text-center text-[#475569]">Access Denied (S10)</div>}
            />
            <Route
              path="*"
              element={<div className="p-8 text-center text-[#475569]">Page Not Found</div>}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
