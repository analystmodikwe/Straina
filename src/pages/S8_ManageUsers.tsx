import { useEffect, useState } from 'react'
import { useToast } from '../components/Toast'
import { getUsers, updateRole } from '../api/users'
import { MESSAGES } from '../lib/messages'
import type { Profile, Role } from '../types'

interface ManageUsersState {
  profiles: Profile[]
  loading: boolean
  error: string | null
}

export function S8_ManageUsers() {
  const { showToast } = useToast()
  const [state, setState] = useState<ManageUsersState>({
    profiles: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const profiles = await getUsers()
      setState({ profiles, loading: false, error: null })
    } catch {
      setState({ profiles: [], loading: false, error: MESSAGES.ERR11 })
    }
  }

  const handleRoleChange = async (userId: string, newRole: Role) => {
    const targetProfile = state.profiles.find((p) => p.id === userId)
    if (!targetProfile) return

    const currentAdmins = state.profiles.filter((p) => p.role === 'admin')
    const isLastAdmin = currentAdmins.length === 1 && targetProfile.role === 'admin'
    const demotingLastAdmin = isLastAdmin && newRole !== 'admin'

    if (demotingLastAdmin) {
      showToast(MESSAGES.ERR11, 'error')
      return
    }

    try {
      await updateRole(userId, newRole)
      showToast(MESSAGES.TOAST_ROLE_UPDATED, 'success')
      await loadUsers()
    } catch {
      showToast(MESSAGES.ERR11, 'error')
    }
  }

  if (state.loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-sm text-[#475569]">
        Loading users...
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="p-8 text-center text-error">
        {state.error}
      </div>
    )
  }

  if (state.profiles.length === 0) {
    return (
      <div className="p-8 text-center text-[#475569]">
        No users found.
      </div>
    )
  }

  const roles: Role[] = ['admin', 'data_submitter', 'analyst']

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Manage Users</h1>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#0F172A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3 text-sm text-[#0F172A]">{profile.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={profile.role}
                    onChange={(e) => handleRoleChange(profile.id, e.target.value as Role)}
                    disabled={
                      state.profiles.filter((p) => p.role === 'admin').length === 1 &&
                      profile.role === 'admin'
                    }
                    className="min-h-control-touch px-3 py-2 text-sm border border-border rounded bg-surface text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-[#475569]">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-[#475569]">
                  {state.profiles.filter((p) => p.role === 'admin').length === 1 &&
                  profile.role === 'admin' && (
                    <span className="text-xs text-text-muted">Cannot demote sole admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}