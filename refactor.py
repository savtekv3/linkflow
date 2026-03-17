import os
import re

DIR = r"c:\Users\cemir.EMIRHAN\OneDrive\Desktop\Projeler\LinkTrack"

def get_sidebar(active_page):
    # Base sidebar HTML without "Teams"
    sidebar = """<!-- BEGIN: Sidebar Navigation -->
<aside class="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800" data-purpose="main-sidebar">
<div class="p-6 flex items-center gap-3 border-b border-slate-800">
<div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
</svg>
</div>
<span class="font-bold text-xl tracking-tight">LinkTrack</span>
</div>
<nav class="flex-1 overflow-y-auto py-6" data-purpose="sidebar-nav">
<ul class="space-y-1 px-4">
<li>
<a class="flex items-center gap-3 px-3 py-2 {DASH_CLASS} rounded-md transition-colors" href="dashboard.html">
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16m-7 6h7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
<span class="font-medium">Dashboard</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 {ANA_CLASS} rounded-md transition-colors" href="analytics.html">
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
<span>Analytics</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 {SET_CLASS} rounded-md transition-colors" href="settings.html">
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
<span>Settings</span>
</a>
</li>
</ul>
</nav>
<div class="p-4 border-t border-slate-800">
<div class="flex items-center gap-3">
<img alt="User Profile" class="w-10 h-10 rounded-full border border-slate-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_ytpoyeB59Gm4xj8vrHALUOHc_spOv4je5jIhEB3j3i7tvyVZgdNygoLC9R71dqRobH53M8ZTgsfju5GokMxVR0SHc0hwMxiJC37HMyyu4SAGpUje1oIZSpOXJuZ-Nw8aSqg8zfxtuLeGjIQYpA5nKV5MZqPkeRPuNdrFePSLKRoQq6p8cf958zafzazgEL8WMdI1MImalgV8Jw2zYkVyTevYpdjWeNUitcRNXo9CHWa3OUAEpZ_15GYifGIDsn-IXUpYg-pdpKq"/>
<div class="overflow-hidden">
<p class="text-sm font-semibold truncate text-slate-100">Alex Rivera</p>
<p class="text-xs text-slate-400 truncate">alex@example.com</p>
</div>
</div>
</div>
</aside>
<!-- END: Sidebar Navigation -->"""
    
    classes = {
        'dashboard': 'text-slate-400 hover:text-white hover:bg-slate-800/50',
        'analytics': 'text-slate-400 hover:text-white hover:bg-slate-800/50',
        'settings': 'text-slate-400 hover:text-white hover:bg-slate-800/50',
    }
    classes[active_page] = 'bg-blue-600 text-white'
    return sidebar.replace('{DASH_CLASS}', classes['dashboard']) \
                  .replace('{ANA_CLASS}', classes['analytics']) \
                  .replace('{SET_CLASS}', classes['settings'])

def process_dashboard():
    with open(os.path.join(DIR, 'dashboard.html'), 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace old sidebar with the unified one (removes Team)
    new_sidebar = get_sidebar('dashboard')
    content = re.sub(r'<!-- BEGIN: Sidebar Navigation -->.*?<!-- END: Sidebar Navigation -->', new_sidebar, content, flags=re.DOTALL)

    with open(os.path.join(DIR, 'dashboard.html'), 'w', encoding='utf-8') as f:
        f.write(content)

def process_analytics():
    with open(os.path.join(DIR, 'analytics.html'), 'r', encoding='utf-8') as f:
        content = f.read()

    # Standardize colors
    content = content.replace('bg-brand-background', 'bg-slate-950')
    content = content.replace('bg-brand-surface', 'bg-slate-900')
    content = content.replace('border-brand-border', 'border-slate-800')
    content = content.replace('text-brand-accent', 'text-blue-400')
    content = content.replace('bg-brand-accent', 'bg-blue-500')
    content = content.replace('border-brand-accent', 'border-blue-500')
    content = content.replace('ring-brand-accent', 'ring-blue-500')
    content = content.replace('focus:ring-brand-accent', 'focus:ring-blue-500')
    content = content.replace('focus:border-brand-accent', 'focus:border-blue-500')
    content = content.replace('#22d3ee', '#3b82f6') # Blue-500 hex equivalent for charts

    # Remove the <header> top nav
    content = re.sub(r'<!-- BEGIN: MainHeader -->.*?<!-- END: MainHeader -->', '', content, flags=re.DOTALL)
    
    # Change body wrapper
    content = re.sub(r'<body[^>]*>', '<body class="bg-slate-950 font-sans text-slate-200 h-screen flex overflow-hidden">', content)

    # Insert Layout
    inner_main = re.search(r'<main[^>]*>(.*?)</main>', content, flags=re.DOTALL)
    if inner_main:
        main_content = inner_main.group(1)
        sidebar = get_sidebar('analytics')
        new_layout = f'''{sidebar}
<!-- BEGIN: Main Dashboard Content -->
<main class="flex-1 flex flex-col h-screen overflow-hidden">
<header class="bg-slate-900 h-16 shrink-0 border-b border-slate-800 flex items-center justify-between px-8" data-purpose="top-header">
<div>
<h1 class="text-xl font-bold text-slate-100">Analytics</h1>
<p class="text-xs text-slate-400">Detailed performance metrics for your links</p>
</div>
</header>
<section class="flex-1 overflow-auto p-8" data-purpose="main-table-container">
{main_content}
</section>
</main>
<!-- END: Main Dashboard Content -->'''
        content = re.sub(r'<main[^>]*>.*?</main>', new_layout, content, flags=re.DOTALL)
    
    with open(os.path.join(DIR, 'analytics.html'), 'w', encoding='utf-8') as f:
        f.write(content)


def process_settings():
    with open(os.path.join(DIR, 'settings.html'), 'r', encoding='utf-8') as f:
        content = f.read()

    # Standardize colors
    content = content.replace('bg-navy-900', 'bg-slate-950')
    content = content.replace('bg-navy-800', 'bg-slate-900')
    content = content.replace('navy-800', 'slate-900')
    content = content.replace('bg-charcoal-800', 'bg-slate-800')
    content = content.replace('bg-charcoal-700', 'bg-slate-700')
    content = content.replace('navy-700', 'slate-700')
    content = content.replace('charcoal-700', 'slate-700')
    content = content.replace('charcoal-800', 'slate-800')

    # Remove the <header> top nav
    content = re.sub(r'<!-- BEGIN: MainHeader -->.*?<!-- END: MainHeader -->', '', content, flags=re.DOTALL)
    
    # Change body wrapper
    content = re.sub(r'<body[^>]*>', '<body class="bg-slate-950 font-sans text-slate-200 h-screen flex overflow-hidden">', content)

    # Insert Layout
    inner_main = re.search(r'<main[^>]*>(.*?)</main>', content, flags=re.DOTALL)
    if inner_main:
        main_content = inner_main.group(1)
        sidebar = get_sidebar('settings')
        new_layout = f'''{sidebar}
<!-- BEGIN: Main Dashboard Content -->
<main class="flex-1 flex flex-col h-screen overflow-hidden">
<header class="bg-slate-900 h-16 shrink-0 border-b border-slate-800 flex items-center justify-between px-8" data-purpose="top-header">
<div>
<h1 class="text-xl font-bold text-slate-100">Settings</h1>
<p class="text-xs text-slate-400">Manage your account and preferences</p>
</div>
</header>
<section class="flex-1 overflow-auto p-8" data-purpose="main-table-container">
<div class="max-w-4xl mx-auto">
{main_content}
</div>
</section>
</main>
<!-- END: Main Dashboard Content -->'''
        # Also remove Footer since sidebar layout doesn't use the old footer placement
        content = re.sub(r'<!-- BEGIN: Footer -->.*?<!-- END: Footer -->', '', content, flags=re.DOTALL)
        content = re.sub(r'<main[^>]*>.*?</main>', new_layout, content, flags=re.DOTALL)

    with open(os.path.join(DIR, 'settings.html'), 'w', encoding='utf-8') as f:
        f.write(content)

def process_index():
    with open(os.path.join(DIR, 'index.html'), 'r', encoding='utf-8') as f:
        content = f.read()

    # Standardize colors
    content = content.replace('bg-dark-background', 'bg-slate-950')
    content = content.replace('bg-dark-card', 'bg-slate-900')
    content = content.replace('bg-dark-input', 'bg-slate-800')
    content = content.replace('brand-600', 'blue-600')
    content = content.replace('brand-500', 'blue-500')
    content = content.replace('brand-700', 'blue-700')
    content = content.replace('brand-400', 'blue-400')
    content = content.replace('brand-900', 'blue-900')
    content = content.replace('border-slate-800', 'border-slate-800') # keep
    content = content.replace('#0a0f1d', '#020617') # Match slate-950

    with open(os.path.join(DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    process_dashboard()
    process_analytics()
    process_settings()
    process_index()
    print("Refactoring complete.")
