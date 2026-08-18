import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userNotificationApi } from '../shared/api/userApi';
import {
  Bell,
  CheckCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
  Sparkles,
  ExternalLink,
  Flame,
  X
} from 'lucide-react';

export default function NotificationBell({ portalType = 'USER' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchUnread = async () => {
    try {
      const res = await userNotificationApi.getUnreadCount();
      if (res?.data?.unreadCount !== undefined) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      // Non-blocking
    }
  };

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const res = await userNotificationApi.getRecent();
      if (res?.data) {
        setNotifications(res.data);
      }
    } catch {
      // Non-blocking
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000); // 20s polling
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRecent();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await userNotificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Non-blocking
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      userNotificationApi.markAsRead(notif.id).catch(() => {});
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setIsOpen(false);
    if (notif.targetUrl) {
      navigate(notif.targetUrl);
    } else if (notif.referenceId) {
      navigate(portalType === 'ADMIN' ? `/admin/problems` : `/user/problems/${notif.referenceId}`);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'COMPLAINT_CREATED':
        return <FileText className="w-4 h-4 text-pine-600" />;
      case 'COMPLAINT_ASSIGNED':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'WORK_STARTED':
      case 'PROGRESS_UPDATED':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'WORK_COMPLETED':
      case 'VERIFICATION_REQUESTED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'COMPLAINT_REOPENED':
      case 'ESCALATION':
      case 'SLA_OVERDUE':
        return <Flame className="w-4 h-4 text-red-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        id={`notification-bell-${portalType.toLowerCase()}`}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-300 hover:text-white rounded-xl hover:bg-stone-800 transition focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[9px] font-black items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-stone-200 py-3 z-50 animate-fadeIn text-stone-900">
          {/* Header */}
          <div className="px-4 pb-3 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-pine-700" />
              <span className="font-black text-sm text-stone-900">सूचनाएं (Notifications)</span>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-pine-700 hover:text-pine-900 flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
            {loading ? (
              <div className="py-8 text-center text-xs text-stone-500 font-medium">Loading alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2 px-4">
                <Bell className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500 font-semibold">No recent notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-pine-50/50 cursor-pointer transition flex items-start space-x-3 text-xs ${
                    !n.read ? 'bg-emerald-50/40 font-semibold' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-stone-200 flex-shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xs text-stone-900 truncate">{n.title}</h4>
                      <span className="text-[10px] text-stone-600 font-mono flex-shrink-0 ml-1">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed font-normal">
                      {n.message}
                    </p>
                    {n.referenceCode && (
                      <span className="inline-block font-mono text-[9px] font-bold text-pine-800 bg-pine-50 px-1.5 py-0.2 rounded border border-pine-200">
                        {n.referenceCode}
                      </span>
                    )}
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
