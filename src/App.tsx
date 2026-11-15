import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { S1_HomeMap } from './pages/S1_HomeMap'
import { S2_Explore } from './pages/S2_Explore'
import { S3_AreaDetail } from './pages/S3_AreaDetail'
import { S4_About } from './pages/S4_About'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<S1_HomeMap />} />
            <Route path="/explore" element={<S2_Explore />} />
            <Route path="/areas/:areaCode" element={<S3_AreaDetail />} />
            <Route path="/about" element={<S4_About />} />
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
