'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    UserRound,
    LayoutDashboard,
    Search,
    Bell,
    Settings,
    LogOut,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ShieldCheck,
    CreditCard,
    History,
    Menu,
    X
} from 'lucide-react';

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['dashboard', 'users', 'agents', 'transactions', 'settings'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-slate-900 text-slate-400 fixed h-full transition-all duration-300 z-50 flex flex-col`}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-indigo flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    {isSidebarOpen && <span className="text-xl font-bold text-white tracking-tight">Admin CP</span>}
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-2">
                    <NavLink
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        label="Dashboard"
                        active={activeSection === 'dashboard'}
                        collapsed={!isSidebarOpen}
                        onClick={() => scrollToSection('dashboard')}
                    />
                    <NavLink
                        icon={<UserRound className="w-5 h-5" />}
                        label="Users"
                        active={activeSection === 'users'}
                        collapsed={!isSidebarOpen}
                        onClick={() => scrollToSection('users')}
                    />
                    <NavLink
                        icon={<Users className="w-5 h-5" />}
                        label="Agents"
                        active={activeSection === 'agents'}
                        collapsed={!isSidebarOpen}
                        onClick={() => scrollToSection('agents')}
                    />
                    <NavLink
                        icon={<History className="w-5 h-5" />}
                        label="Transactions"
                        active={activeSection === 'transactions'}
                        collapsed={!isSidebarOpen}
                        onClick={() => scrollToSection('transactions')}
                    />
                    <NavLink
                        icon={<Settings className="w-5 h-5" />}
                        label="Settings"
                        active={activeSection === 'settings'}
                        collapsed={!isSidebarOpen}
                        onClick={() => scrollToSection('settings')}
                    />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="nav-link w-full text-slate-400 hover:text-rose-400 hover:bg-rose-400/10">
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Topbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h1 className="text-lg font-semibold text-slate-800 capitalize">
                            {activeSection}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full gradient-slate flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-100">
                            AD
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-24 pb-24">
                    {/* Dashboard Section */}
                    <section id="dashboard" className="scroll-mt-24 space-y-8 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Revenue"
                                value="$128,430"
                                trend="+12.5%"
                                up={true}
                                icon={<TrendingUp className="w-6 h-6" />}
                                gradient="gradient-indigo"
                            />
                            <StatCard
                                title="Active Users"
                                value="45,210"
                                trend="+8.2%"
                                up={true}
                                icon={<UserRound className="w-6 h-6" />}
                                gradient="gradient-violet"
                            />
                            <StatCard
                                title="Total Agents"
                                value="1,240"
                                trend="+2.4%"
                                up={true}
                                icon={<Users className="w-6 h-6" />}
                                gradient="gradient-emerald"
                            />
                            <StatCard
                                title="Failed Trans"
                                value="24"
                                trend="-4.1%"
                                up={false}
                                icon={<CreditCard className="w-6 h-6" />}
                                gradient="gradient-rose"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 card overflow-hidden border-none shadow-glow-indigo/5 ring-1 ring-slate-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-slate-800">Transaction Volume</h3>
                                    <select className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 outline-none">
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                    </select>
                                </div>
                                <div className="h-64 flex items-end justify-between gap-2 px-2">
                                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                        <div key={i} className="flex-1 space-y-2 group flex flex-col items-center">
                                            <div
                                                style={{ height: `${h}%` }}
                                                className="w-full rounded-t-lg bg-primary-100 group-hover:bg-primary-500 transition-all duration-300 relative"
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    ${h * 12}k
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium uppercase">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card space-y-6">
                                <h3 className="text-slate-800">Recent Activity</h3>
                                <div className="space-y-4">
                                    <ActivityItem
                                        title="New Agent Joined"
                                        time="2 mins ago"
                                        icon={<Users className="w-4 h-4 text-emerald-500" />}
                                        color="bg-emerald-50"
                                    />
                                    <ActivityItem
                                        title="Withdrawal Request"
                                        time="15 mins ago"
                                        icon={<CreditCard className="w-4 h-4 text-amber-500" />}
                                        color="bg-amber-50"
                                    />
                                    <ActivityItem
                                        title="User Account Locked"
                                        time="1 hour ago"
                                        icon={<ShieldCheck className="w-4 h-4 text-rose-500" />}
                                        color="bg-rose-50"
                                    />
                                    <ActivityItem
                                        title="System Update"
                                        time="3 hours ago"
                                        icon={<Settings className="w-4 h-4 text-slate-500" />}
                                        color="bg-slate-50"
                                    />
                                </div>
                                <button className="w-full py-2 text-primary-600 text-sm font-medium hover:bg-primary-50 rounded-lg transition-colors">
                                    View All Activity
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Users Section */}
                    <section id="users" className="scroll-mt-24 space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                                <p className="text-slate-500 text-sm">Manage and monitor all platform users</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="btn btn-outline py-2">Export CSV</button>
                                <button className="btn btn-primary py-2 text-sm">+ Add New User</button>
                            </div>
                        </div>

                        <div className="card p-0 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Balance</th>
                                        <th className="px-6 py-4">Transactions</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <UserRow
                                        name="John Doe"
                                        email="john@example.com"
                                        status="Active"
                                        balance="$1,240.00"
                                        totalTrans="142"
                                        date="Oct 12, 2023"
                                    />
                                    <UserRow
                                        name="Sarah Wilson"
                                        email="sarah.w@example.com"
                                        status="Active"
                                        balance="$4,120.50"
                                        totalTrans="89"
                                        date="Nov 04, 2023"
                                    />
                                    <UserRow
                                        name="Michael Chen"
                                        email="m.chen@example.com"
                                        status="Pending"
                                        balance="$0.00"
                                        totalTrans="0"
                                        date="Dec 28, 2023"
                                    />
                                    <UserRow
                                        name="Emily Blunt"
                                        email="emily@example.com"
                                        status="Suspended"
                                        balance="$450.25"
                                        totalTrans="34"
                                        date="Sep 15, 2023"
                                    />
                                </tbody>
                            </table>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs text-slate-500">Showing 4 of 45,210 users</span>
                                <div className="flex gap-2">
                                    <button className="btn btn-secondary px-3 py-1 shadow-none">Prev</button>
                                    <button className="btn btn-secondary px-3 py-1 shadow-none">Next</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Agents Section */}
                    <section id="agents" className="scroll-mt-24 space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Agent Performance</h2>
                                <p className="text-slate-500 text-sm">Monitor agent activities and commissions</p>
                            </div>
                            <button className="btn btn-primary py-2 text-sm">+ New Agent</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AgentCard name="Alex Rivera" region="Dhaka" revenue="$24,500" agents="12" />
                            <AgentCard name="Monica Geller" region="Chittagong" revenue="$18,200" agents="8" />
                            <AgentCard name="Daniel Craig" region="Sylhet" revenue="$12,900" agents="5" />
                        </div>
                    </section>

                    {/* Transactions Section */}
                    <section id="transactions" className="scroll-mt-24 space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Recent Transactions</h2>
                                <p className="text-slate-500 text-sm">Real-time log of all platform activities</p>
                            </div>
                            <div className="flex gap-3">
                                <input type="date" className="input py-2 pr-2" />
                                <button className="btn btn-outline py-2 border-slate-200">Filter</button>
                            </div>
                        </div>

                        <div className="card p-0 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex gap-4">
                                <button className="text-sm font-semibold text-primary-600 border-b-2 border-primary-600 pb-1 px-2">All Payments</button>
                                <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-1 px-2">Withdrawals</button>
                                <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-1 px-2">Deposits</button>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white text-slate-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <TransactionRow id="#TX-94021" desc="Cash out by User" amount="- $120.00" date="2 mins ago" status="Completed" />
                                    <TransactionRow id="#TX-94020" desc="Add Money by Agent" amount="+ $500.00" date="12 mins ago" status="Processing" />
                                    <TransactionRow id="#TX-94019" desc="Transfer to Wallet" amount="- $45.00" date="1 hour ago" status="Completed" />
                                    <TransactionRow id="#TX-94018" desc="System Commission" amount="+ $1.20" date="1 hour ago" status="Completed" />
                                    <TransactionRow id="#TX-94017" desc="Merchant Payment" amount="- $230.50" date="3 hours ago" status="Completed" />
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Settings Section */}
                    <section id="settings" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">System Settings</h2>
                        <div className="card grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-slate-800 mb-4">Account Security</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Two-Factor Authentication</p>
                                                <p className="text-xs text-slate-500">Add an extra layer of security</p>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" checked readOnly />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">Login Notifications</p>
                                                <p className="text-xs text-slate-500">Get notified when someone logs in</p>
                                            </div>
                                            <input type="checkbox" className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-slate-800 mb-4">Appearance</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border-2 border-primary-500 rounded-xl bg-white space-y-2 cursor-pointer">
                                        <div className="w-full h-8 bg-slate-100 rounded"></div>
                                        <p className="text-xs font-bold text-center">Light Theme</p>
                                    </div>
                                    <div className="p-4 border-2 border-slate-100 rounded-xl bg-slate-900 space-y-2 cursor-pointer grayscale opacity-50">
                                        <div className="w-full h-8 bg-slate-800 rounded"></div>
                                        <p className="text-xs font-bold text-center text-slate-400">Dark (Coming Soon)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function NavLink({ icon, label, active, collapsed, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`nav-link w-full ${active ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
        >
            {icon}
            {!collapsed && <span>{label}</span>}
        </button>
    );
}

function StatCard({ title, value, trend, up, icon, gradient }: any) {
    return (
        <div className={`stat-card ${gradient}`}>
            <div className="flex justify-between items-start relative z-10">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/20 backdrop-blur-md ${up ? 'text-white' : 'text-white'}`}>
                    {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div className="mt-4 relative z-10">
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold mt-1">{value}</h3>
            </div>
        </div>
    );
}

function ActivityItem({ title, time, icon, color }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{title}</p>
                <p className="text-[10px] text-slate-400">{time}</p>
            </div>
        </div>
    );
}

function UserRow({ name, email, status, balance, totalTrans, date }: any) {
    const statusColors: any = {
        Active: 'badge-success',
        Pending: 'badge-warning',
        Suspended: 'badge-error'
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs uppercase">
                        {name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{name}</p>
                        <p className="text-xs text-slate-400">{email}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`badge ${statusColors[status]}`}>{status}</span>
            </td>
            <td className="px-6 py-4 font-medium text-slate-700">{balance}</td>
            <td className="px-6 py-4 text-slate-500">{totalTrans}</td>
            <td className="px-6 py-4 text-slate-500">{date}</td>
            <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary-600 transition-colors">
                    <Settings className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

function AgentCard({ name, region, revenue, agents }: any) {
    return (
        <div className="card space-y-4 hover:shadow-glow-indigo/10 transition-all border-none ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-slate flex items-center justify-center text-white font-bold">
                    {name[0]}
                </div>
                <div>
                    <h4 className="text-slate-800">{name}</h4>
                    <p className="text-xs text-slate-400">{region} Branch</p>
                </div>
            </div>
            <div className="flex justify-between items-center pt-2">
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Revenue</p>
                    <p className="text-lg font-bold text-slate-800">{revenue}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sub-Agents</p>
                    <p className="text-lg font-bold text-slate-800">{agents}</p>
                </div>
            </div>
            <button className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors">
                View Full Report
            </button>
        </div>
    );
}

function TransactionRow({ id, desc, amount, date, status }: any) {
    const isNegative = amount.startsWith('-');
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 font-mono text-xs text-slate-400">{id}</td>
            <td className="px-6 py-4">
                <p className="font-medium text-slate-700">{desc}</p>
            </td>
            <td className={`px-6 py-4 font-bold ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                {amount}
            </td>
            <td className="px-6 py-4 text-slate-500 text-xs">{date}</td>
            <td className="px-6 py-4">
                <span className={`badge ${status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
}
