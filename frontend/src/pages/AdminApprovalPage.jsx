import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, CheckCircle, XCircle, Clock, Search, ShieldCheck } from 'lucide-react'
import { adminApi } from '../api'
import { toast } from 'react-hot-toast'
import Loading from '../components/Loading'


export default function AdminApprovalPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-pending-users'],
    queryFn: adminApi.getPendingUsers
  })

  const { data: allUsers, isLoading: loadingAll } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: adminApi.getAllUsers
  })

  const filteredPending = useMemo(() => {
    if (!users) return []
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const filteredProcessed = useMemo(() => {
    if (!allUsers) return []
    return allUsers
      .filter(u => u.status !== 'PENDING')
      .filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [allUsers, searchTerm])


  const approveMutation = useMutation({
    mutationFn: adminApi.approveUser,
    onSuccess: () => {
      toast.success('User approved successfully!')
      queryClient.invalidateQueries(['admin-pending-users'])
      queryClient.invalidateQueries(['admin-all-users'])
    },
    onError: () => toast.error('Approval failed')
  })

  const rejectMutation = useMutation({
    mutationFn: adminApi.rejectUser,
    onSuccess: () => {
      toast.error('User application rejected')
      queryClient.invalidateQueries(['admin-pending-users'])
      queryClient.invalidateQueries(['admin-all-users'])
    },
    onError: () => toast.error('Action failed')
  })


  if (isLoading || loadingAll) return <Loading />

  return (
    <div className="page-wrapper container animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Governance
          </div>
          <h1 className="text-4xl font-heading font-black mb-2">Account Approvals</h1>
          <p className="text-slate-400 font-body">Review and manage new guest registration applications.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none transition-all font-medium placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-all"
              title="Clear search"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Pending Section */}
        <section>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500" /> Pending Applications
            {filteredPending.length > 0 && <span className="bg-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black">{filteredPending.length}</span>}
          </h2>
          
          {filteredPending.length === 0 ? (
            <div className="card-premium p-12 text-center text-slate-500 font-body">
              {searchTerm ? `No pending applications match "${searchTerm}"` : 'All applications have been processed. No pending requests.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPending.map((user) => (
                <div key={user.id} className="card-premium p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500/30">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/20">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-none mb-1">{user.name}</h4>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded tracking-tighter">
                          Role: {user.role}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {user.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => approveMutation.mutate(user.id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => rejectMutation.mutate(user.id)}
                      disabled={rejectMutation.isPending}
                      className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all group"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Audit Log / All Users */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-400" /> System Audit Log
            </h2>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              {filteredProcessed.length} Accounts Logged
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredProcessed.map((user) => (
              <div key={user.id} className="card-premium p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Role</span>
                    <span className="text-xs font-semibold text-slate-300">{user.role}</span>
                  </div>

                  <div className="flex flex-col items-end min-w-[100px]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
                      user.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      {user.status === 'APPROVED' ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredProcessed.length === 0 && (
              <div className="card-premium p-12 text-center border-dashed">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No processed users match your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
