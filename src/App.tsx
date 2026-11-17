import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { S1_HomeMap } from './pages/S1_HomeMap'
import { S2_Explore } from './pages/S2_Explore'
import { S3_AreaDetail } from './pages/S3_AreaDetail'
import { S4_About } from './pages/S4_About'
import { S5_SignIn } from './pages/S5_SignIn'
import { S8_ManageUsers } from './pages/S8_ManageUsers'
import { S9_ManageSources } from './pages/S9_ManageSources'
import { S10_AccessDenied } from './pages/S10_AccessDenied'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './components/Toast'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
            <Header />
            <main className="flex-1 flex flex-col">
              <Routes>
                {/* Public routes (OQ10) */}
                <Route path="/" element={<S1_HomeMap />} />
                <Route path="/explore" element={<S2_Explore />} />
                <Route path="/areas/:areaCode" element={<S3_AreaDetail />} />
                <Route path="/about" element={<S4_About />} />
                <Route path="/sign-in" element={<S5_SignIn />} />
                <Route path="/access-denied" element={<S10_AccessDenied />} />

                {/* Role-protected routes */}
                <Route
                  path="/records"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'data_submitter']}>
                      <div className="p-8 text-center text-[#475569]">Records List (S7)</div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/records/new"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'data_submitter']}>
                      <div className="p-8 text-center text-[#475569]">Submit Record (S6)</div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/records/:recordId/edit"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'data_submitter']}>
                      <div className="p-8 text-center text-[#475569]">Edit Record (S6)</div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <S8_ManageUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sources"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <S9_ManageSources />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="*"
                  element={<div className="p-8 text-center text-[#475569]">Page Not Found</div>}
                />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
