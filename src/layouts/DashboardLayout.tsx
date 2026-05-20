import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { DashboardHeaderProvider, useDashboardHeader } from '@/layouts/DashboardHeaderContext'

function DashboardShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { header } = useDashboardHeader()

  return (
    <div className="flex min-h-svh bg-[var(--color-surface)] dark:bg-zinc-950">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={header.title}
          subtitle={header.subtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <DashboardHeaderProvider>
      <DashboardShell />
    </DashboardHeaderProvider>
  )
}
