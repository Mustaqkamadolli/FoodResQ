import React from 'react';
import { NotificationItem } from '../types';
import { store } from '../services/store';
import { X, Bell, Check } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onSelectListing?: (listingId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectListing
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    store.markAllNotificationsAsRead();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#e7e5e4] text-[#000000] w-full max-w-md h-full border-l border-[#dfdcd5] flex flex-col justify-between font-grotesk shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-[#dfdcd5] flex items-center justify-between bg-[#c4c3b6]">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#595855] block mb-0.5">
              CIVIC DISPATCHES
            </span>
            <h3 className="font-davinci text-2xl font-medium tracking-tight text-[#000000]">
              Notifications
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#595855] hover:text-[#000000] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-[#595855] space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs font-medium">No active dispatches</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  store.markNotificationAsRead(item.id);
                  if (item.listingId && onSelectListing) {
                    onSelectListing(item.listingId);
                    onClose();
                  }
                }}
                className={`p-4 rounded-[9px] border transition-colors cursor-pointer ${
                  !item.read
                    ? 'bg-[#ffffff] border-[#000000]'
                    : 'bg-[#c4c3b6]/60 border-[#dfdcd5] hover:bg-[#c4c3b6]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-davinci text-base font-medium text-[#000000] leading-snug">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#000000] shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-[#595855] mt-1 leading-relaxed">
                  {item.message}
                </p>
                <span className="text-[10px] text-[#808080] mt-2 block">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#dfdcd5] flex justify-between items-center bg-[#c4c3b6]">
          <button
            onClick={handleMarkAllRead}
            className="ghost-link text-xs text-[#000000]"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="btn-pill"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
