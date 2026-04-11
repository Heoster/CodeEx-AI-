'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {type Settings} from '@/lib/types';
import {ChatPanel} from '@/app/chat/chat-panel';
import {Button} from '@/components/ui/button';
import {
  MessageSquarePlus,
  Settings as SettingsIcon,
  LogOut,
  Trash2,
  Calculator,
  FileText,
  LayoutGrid,
  Boxes,
  LayoutDashboard,
} from 'lucide-react';
import {Edit2, Download, User} from 'lucide-react';
import {QuickSettingsPopover, SettingsDialog} from '../settings-dialog';
import {useAuth} from '@/hooks/use-auth';
import {getAuth, signOut} from 'firebase/auth';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {useChatHistory} from '@/hooks/use-chat-history';
import {useLocalStorage} from '@/hooks/use-local-storage';
import { InstallPWAButton } from '../install-pwa-button';

const defaultSettings: Settings = {
  model: 'auto',
  tone: 'helpful',
  technicalLevel: 'intermediate',
  enableSpeech: false,
  voice: 'troy',
};

// Must be rendered inside SidebarProvider to access useSidebar
function MobileChatsButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-muted-foreground transition-colors active:bg-accent touch-manipulation"
      onClick={toggleSidebar}
    >
      <LayoutDashboard className="h-5 w-5" />
      <span className="text-[10px] font-medium">Chats</span>
    </button>
  );
}

export function ChatLayout() {
  const {user} = useAuth();
  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    activeChatMessages,
    createNewChat,
    deleteAllUserChats,
    addMessage,
    deleteChat,
    renameChat,
    exportChat,
  } = useChatHistory();

  // Persist settings to localStorage
  const [settings, setSettings] = useLocalStorage<Settings>(
    user?.uid ? `${user.uid}_settings` : 'guest_settings',
    defaultSettings
  );
  const [isClearHistoryAlertOpen, setIsClearHistoryAlertOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const auth = getAuth();

  // Auto-create new chat when user logs in or app restarts
  useEffect(() => {
    if (user && chats.length === 0) {
      console.log('[ChatLayout] Auto-creating new chat for user');
      createNewChat();
    }
  }, [user, chats.length, createNewChat]);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleConfirmClearHistory = async () => {
    deleteAllUserChats();
    setIsClearHistoryAlertOpen(false);
  };

  return (
    <SidebarProvider defaultOpen={typeof window !== 'undefined' && window.innerWidth >= 768}>
      <Sidebar variant="inset" collapsible="offcanvas">
        <SidebarHeader className="space-y-4 border-b p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/FINALSOHAM.png"
                alt="SOHAM icon"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
            <div>
              <h1 className="text-lg font-bold">SOHAM</h1>
              <p className="text-xs text-muted-foreground">Adaptive AI workspace</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="default"
              size="sm"
              className="justify-start gap-2 h-10 font-medium shadow-sm"
              onClick={createNewChat}
              disabled={!user}
            >
              <MessageSquarePlus className="h-4 w-4" />
              NEW
            </Button>
            <QuickSettingsPopover
              settings={settings}
              onSettingsChange={setSettings}
              onOpenFullSettings={() => setIsSettingsOpen(true)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 justify-start gap-2 h-9 text-xs"
              onClick={() => setIsClearHistoryAlertOpen(true)}
              disabled={!user || chats.length === 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
            <InstallPWAButton
              variant="outline"
              size="sm"
              className="flex-1 justify-start gap-2 h-9 text-xs"
            />
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-3">
          <SidebarMenu className="space-y-1">
            <div className="pb-3 mb-3 border-b space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Workspace
              </p>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-9">
                  <Link href="/ai-services" className="gap-3">
                    <Boxes className="h-4 w-4" />
                    <span>AI Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-9">
                  <Link href="/visual-math" className="gap-3">
                    <Calculator className="h-4 w-4" />
                    <span>Visual Math Solver</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-9">
                  <Link href="/pdf-analyzer" className="gap-3">
                    <FileText className="h-4 w-4" />
                    <span>PDF Analyzer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-9">
                  <Link href="/account" className="gap-3">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
            
            {chats.length > 0 && (
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent Chats
                </p>
                {chats.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <div className="group/item flex items-center w-full rounded-md hover:bg-accent transition-colors">
                      <SidebarMenuButton
                        isActive={chat.id === activeChatId}
                        onClick={() => {
                          setActiveChatId(chat.id);
                        }}
                        className="flex-1 truncate h-9"
                      >
                        <span className="truncate text-sm">{chat.title}</span>
                      </SidebarMenuButton>
                      <div className="hidden group-hover/item:flex items-center gap-0.5 pr-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTitle = window.prompt('Rename chat', chat.title);
                            if (newTitle && newTitle.trim().length > 0) {
                              renameChat(chat.id, newTitle.trim());
                            }
                          }}
                          title="Rename chat"
                          className="h-7 w-7"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            const data = exportChat(chat.id);
                            if (!data) return;
                            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${(chat.title || 'chat').replace(/[^a-z0-9-_]/gi, '_')}-${chat.id}.json`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          }}
                          title="Export chat"
                          className="h-7 w-7"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            const confirmed = window.confirm('Delete this chat?');
                            if (confirmed) deleteChat(chat.id);
                          }}
                          title="Delete chat"
                          className="h-7 w-7 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </SidebarMenuItem>
                ))}
              </div>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4 space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsSettingsOpen(true)}>
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Button>
          {user && (
            <div className="border-t pt-3 flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                <AvatarImage
                  src={user.photoURL ?? ''}
                  alt={user.displayName ?? 'User'}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user.displayName?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {user.displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-6">
          <SidebarTrigger className="-ml-2" />
          <div className="flex items-center gap-2 md:hidden">
            <Image src="/FINALSOHAM.png" alt="SOHAM icon" width={26} height={26} className="rounded-md" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-semibold truncate">
              {activeChat?.title || 'SOHAM'}
            </h1>
            {activeChat && (
              <p className="text-xs text-muted-foreground">
                {activeChatMessages.length} messages
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <QuickSettingsPopover
              settings={settings}
              onSettingsChange={setSettings}
              onOpenFullSettings={() => setIsSettingsOpen(true)}
            />
            <Button variant="outline" size="icon" className="hidden md:inline-flex" onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon className="h-4 w-4" />
              <span className="sr-only">Open settings</span>
            </Button>
          </div>
        </header>

        {activeChat ? (
          <div className="pb-16 md:pb-0">
            <ChatPanel
              key={activeChat.id}
              chat={activeChat}
              settings={settings}
              messages={activeChatMessages}
              addMessage={addMessage}
            />
          </div>
        ) : (
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4 pb-16 md:pb-0">
            <div className="text-center space-y-4 max-w-md">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquarePlus className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold">Start a New Conversation</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Create a new chat to begin talking with SOHAM
                </p>
              </div>
              <Button 
                onClick={createNewChat}
                disabled={!user}
                size="lg"
                className="gap-2"
              >
                <MessageSquarePlus className="h-5 w-5" />
                Chat
              </Button>
            </div>
          </div>
        )}

        {/* ── Mobile bottom navigation bar ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background/95 px-2 pb-safe pt-1 backdrop-blur-sm">
          <button
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-muted-foreground transition-colors active:bg-accent touch-manipulation"
            onClick={createNewChat}
            disabled={!user}
          >
            <MessageSquarePlus className="h-5 w-5" />
            <span className="text-[10px] font-medium">New</span>
          </button>

          <MobileChatsButton />

          <Link
            href="/ai-services"
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-muted-foreground transition-colors active:bg-accent touch-manipulation"
          >
            <Boxes className="h-5 w-5" />
            <span className="text-[10px] font-medium">Services</span>
          </Link>

          <button
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-muted-foreground transition-colors active:bg-accent touch-manipulation"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon className="h-5 w-5" />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </nav>
      </SidebarInset>
      <SettingsDialog
        settings={settings}
        onSettingsChange={setSettings}
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
      <AlertDialog
        open={isClearHistoryAlertOpen}
        onOpenChange={setIsClearHistoryAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all of your chat history from
              this device and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClearHistory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
