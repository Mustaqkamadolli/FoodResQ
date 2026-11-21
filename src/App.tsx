import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  FoodListing,
  ScheduledEvent,
  DeliveryRequest,
  NotificationItem,
  ImpactStats,
  WasteHotspot,
  SupportedLanguage
} from './types';
import { store } from './services/store';

// Components
import { DemoRoleSwitcher } from './components/DemoRoleSwitcher';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { PickupCodeModal } from './components/PickupCodeModal';
import { CertificateModal } from './components/CertificateModal';
import { RatingModal } from './components/RatingModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { LifeSaverAI } from './components/LifeSaverAI';

// Views
import { LandingView } from './views/LandingView';
import { BrowseView } from './views/BrowseView';
import { DonateView } from './views/DonateView';
import { ListingDetailView } from './views/ListingDetailView';
import { MyBookingsView } from './views/MyBookingsView';
import { DonorDashboardView } from './views/DonorDashboardView';
import { EventsView } from './views/EventsView';
import { VolunteerTasksView } from './views/VolunteerTasksView';
import { ImpactView } from './views/ImpactView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';

export function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => store.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);

  // Store data state
  const [listings, setListings] = useState<FoodListing[]>(() => store.getListings());
  const [events, setEvents] = useState<ScheduledEvent[]>(() => store.getEvents());
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>(() => store.getDeliveries());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => store.getNotifications());
  const [impactStats, setImpactStats] = useState<ImpactStats>(() => store.getImpactStats());
  const [hotspots] = useState<WasteHotspot[]>(() => store.getHotspots());

  // Modals
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isNotifsModalOpen, setIsNotifsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Global Toast
  const [globalToast, setGlobalToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setGlobalToast({ message, type });
    setTimeout(() => setGlobalToast(null), 4000);
  };

  // Subscribe to reactive store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setListings(store.getListings());
      setEvents(store.getEvents());
      setDeliveries(store.getDeliveries());
      setNotifications(store.getNotifications());
      setImpactStats(store.getImpactStats());
    });
    return () => unsubscribe();
  }, []);

  // Update selectedListing if it updates in listings
  useEffect(() => {
    if (selectedListing) {
      const updated = listings.find((l) => l.id === selectedListing.id);
      if (updated) setSelectedListing(updated);
    }
  }, [listings]);

  // Handlers
  const handleViewDetails = (listing: FoodListing) => {
    setSelectedListing(listing);
    setActiveTab('listing_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookListing = (listing: FoodListing, requestDelivery: boolean = false) => {
    const result = store.bookListingAtomic(
      listing.id,
      currentUser.id,
      currentUser.organizationName || currentUser.name,
      currentUser.phone,
      currentUser.organizationName,
      requestDelivery
    );

    if (!result.success) {
      alert(result.error || "Unable to book listing.");
      return;
    }

    const updated = store.getListingById(listing.id) || listing;
    setSelectedListing(updated);
    setIsPickupModalOpen(true);
    triggerToast(`Food booked successfully! Your 4-digit code is ${result.pickupCode}`);
  };

  const unreadNotifsCount = store.getUnreadNotificationCount(currentUser.id);

  // Urgent listings (<4 hours safe window)
  const urgentListings = listings.filter((l) => {
    if (l.status !== 'available') return false;
    const diffHrs = (new Date(l.safeUntil).getTime() - Date.now()) / (3600 * 1000);
    return diffHrs > 0 && diffHrs <= 4;
  });

  return (
    <div className="min-h-screen bg-[#FFFBF5] dark:bg-[#07130e] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* Sticky Demo Role Persona Switcher */}
      <DemoRoleSwitcher
        currentUser={currentUser}
        onUserChange={(usr) => {
          setCurrentUser(usr);
          triggerToast(`Switched active role to ${usr.name}`);
        }}
      />

      {/* Main Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotifsModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Global Toast Pill */}
      {globalToast && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 bg-[#064E3B] text-white px-6 py-3 rounded-full shadow-2xl text-xs sm:text-sm font-bold border border-emerald-400/40 flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          <span>{globalToast.message}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 pb-20 md:pb-8">
        {activeTab === 'landing' && (
          <LandingView
            currentLang={currentLang}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            urgentListings={urgentListings}
            impactStats={impactStats}
            onSelectListing={handleViewDetails}
            onBookListing={(l) => handleBookListing(l, false)}
          />
        )}

        {activeTab === 'browse' && (
          <BrowseView
            listings={listings}
            currentLang={currentLang}
            currentUser={currentUser}
            onSelectListing={handleViewDetails}
            onBookListing={(l) => handleBookListing(l, false)}
          />
        )}

        {activeTab === 'donate' && (
          <DonateView
            currentUser={currentUser}
            currentLang={currentLang}
            onSuccess={(newId) => {
              triggerToast("Food donation published live! Nearby NGOs notified.", 'success');
              const found = store.getListingById(newId);
              if (found) {
                setSelectedListing(found);
                setActiveTab('listing_detail');
              } else {
                setActiveTab('browse');
              }
            }}
            onCancel={() => setActiveTab('browse')}
          />
        )}

        {activeTab === 'listing_detail' && selectedListing && (
          <ListingDetailView
            listing={selectedListing}
            currentUser={currentUser}
            currentLang={currentLang}
            onBack={() => setActiveTab('browse')}
            onBook={handleBookListing}
            onOpenPickupCode={() => setIsPickupModalOpen(true)}
            onRate={() => setIsRatingModalOpen(true)}
            onViewRoute={(l) => {
              setSelectedListing(l);
              setActiveTab('browse');
            }}
          />
        )}

        {activeTab === 'bookings' && (
          <MyBookingsView
            currentUser={currentUser}
            currentLang={currentLang}
            listings={listings}
            onOpenPickupCode={(l) => {
              setSelectedListing(l);
              setIsPickupModalOpen(true);
            }}
            onViewDetails={handleViewDetails}
            onRate={(l) => {
              setSelectedListing(l);
              setIsRatingModalOpen(true);
            }}
          />
        )}

        {activeTab === 'donor_dash' && (
          <DonorDashboardView
            currentUser={currentUser}
            currentLang={currentLang}
            listings={listings}
            onOpenDonate={() => setActiveTab('donate')}
            onOpenPickupCode={(l) => {
              setSelectedListing(l);
              setIsPickupModalOpen(true);
            }}
            onOpenCertificate={() => setIsCertModalOpen(true)}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'events' && (
          <EventsView
            currentUser={currentUser}
            currentLang={currentLang}
            events={events}
            onEventCreated={() => triggerToast("Upcoming banquet event scheduled!")}
          />
        )}

        {activeTab === 'volunteer' && (
          <VolunteerTasksView
            currentUser={currentUser}
            currentLang={currentLang}
            deliveries={deliveries}
            onStatusUpdated={() => triggerToast("Delivery status updated successfully")}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactView
            impact={impactStats}
            currentUser={currentUser}
            currentLang={currentLang}
            onOpenCertificate={() => setIsCertModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            currentLang={currentLang}
            onOpenCertificate={() => setIsCertModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            currentUser={currentUser}
            currentLang={currentLang}
            profiles={store.getAllProfiles()}
            hotspots={hotspots}
            onApproved={() => triggerToast("Verified NGO badge granted!")}
          />
        )}
      </main>

      {/* LifeSaverAI Copilot Widget */}
      <LifeSaverAI
        currentUser={currentUser}
        currentLang={currentLang}
        listings={listings}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectListing={(listing) => {
          setSelectedListing(listing);
          setActiveTab('browse');
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
      />

      {/* MODALS */}
      {selectedListing && (
        <PickupCodeModal
          listing={selectedListing}
          currentUser={currentUser}
          isOpen={isPickupModalOpen}
          onClose={() => setIsPickupModalOpen(false)}
          onSuccessCollected={() => {
            triggerToast("Food handover completed! Meals added to rescue total.");
            setIsPickupModalOpen(false);
          }}
          onViewRoute={(l) => {
            setSelectedListing(l);
            setActiveTab('browse');
          }}
        />
      )}

      <CertificateModal
        user={currentUser}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      {selectedListing && (
        <RatingModal
          listingId={selectedListing.id}
          targetUserId={
            currentUser.id === selectedListing.donorId
              ? (selectedListing.bookedById || 'usr_ngo_akshaya')
              : selectedListing.donorId
          }
          targetUserName={
            currentUser.id === selectedListing.donorId
              ? (selectedListing.bookedByName || 'Receiver')
              : selectedListing.donorName
          }
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onRated={() => triggerToast("Thank you for your rating!")}
        />
      )}

      <NotificationsModal
        isOpen={isNotifsModalOpen}
        onClose={() => setIsNotifsModalOpen(false)}
        notifications={notifications}
        onSelectListing={(id) => {
          const found = store.getListingById(id);
          if (found) {
            setSelectedListing(found);
            setActiveTab('listing_detail');
          }
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => triggerToast(`Signed in as ${store.getCurrentUser().name}`)}
      />

    </div>
  );
}

export default App;
