import React, { useState } from 'react';
import { DeliveryRequest, UserProfile, SupportedLanguage } from '../types';
import { store } from '../services/store';
import {
  Truck,
  MapPin,
  Phone,
  ArrowRight
} from 'lucide-react';

interface VolunteerTasksViewProps {
  currentUser: UserProfile;
  currentLang: SupportedLanguage;
  deliveries: DeliveryRequest[];
  onStatusUpdated?: () => void;
}

export const VolunteerTasksView: React.FC<VolunteerTasksViewProps> = ({
  currentUser,
  currentLang,
  deliveries,
  onStatusUpdated
}) => {
  const [filter, setFilter] = useState<'all' | 'open' | 'my_tasks'>('all');

  const myTasks = deliveries.filter((d) => d.volunteerId === currentUser.id);
  const openTasks = deliveries.filter((d) => d.status === 'open');

  const displayed = filter === 'open' 
    ? openTasks 
    : filter === 'my_tasks' 
    ? myTasks 
    : deliveries;

  const handleAcceptTask = (delivery: DeliveryRequest) => {
    store.updateDeliveryStatus(delivery.id, 'accepted', currentUser.id, currentUser.name);
    if (onStatusUpdated) onStatusUpdated();
  };

  const handleMarkPickedUp = (delivery: DeliveryRequest) => {
    store.updateDeliveryStatus(delivery.id, 'picked_up', currentUser.id, currentUser.name);
    if (onStatusUpdated) onStatusUpdated();
  };

  const handleMarkDelivered = (delivery: DeliveryRequest) => {
    store.updateDeliveryStatus(delivery.id, 'delivered', currentUser.id, currentUser.name);
    alert(`Terrific job! You successfully delivered ${delivery.plates} meals to ${delivery.receiverName}. Your volunteer score has increased!`);
    if (onStatusUpdated) onStatusUpdated();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Banner — Bone Card */}
      <div className="card-bone p-6 sm:p-8 space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#000000] bg-[#dfdcd5] px-2.5 py-0.5 rounded-[4px]">
          Volunteer Delivery Logistics
        </span>
        <h1 className="text-3xl sm:text-4xl font-davinci font-normal text-[#000000]">
          Food Transport Hub
        </h1>
        <p className="text-xs sm:text-sm font-sans text-[#595855] leading-relaxed max-w-2xl">
          Many shelters and anathashrams lack vehicles on short notice. Volunteer drivers bridge the last mile by transporting hot food from donors to receivers across Bengaluru.
        </p>

        <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#000000]">
          <span>🛵 Bikes & 2-Wheelers</span>
          <span>·</span>
          <span>🚙 Vans & Autos</span>
          <span>·</span>
          <span>✓ Verified Shelters</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-davinci font-normal text-[#000000]">
            Nearby Transport Requests
          </h2>
          <span className="text-xs font-mono text-[#595855]">
            {openTasks.length} open deliveries waiting for volunteer pickup
          </span>
        </div>

        <div className="flex bg-[#dfdcd5] p-1 rounded-[28.8px] text-xs font-sans">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1 rounded-[28.8px] transition-all ${
              filter === 'all' ? 'bg-[#000000] text-[#ffffff]' : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            All ({deliveries.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3.5 py-1 rounded-[28.8px] transition-all ${
              filter === 'open' ? 'bg-[#000000] text-[#ffffff]' : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            Open ({openTasks.length})
          </button>
          <button
            onClick={() => setFilter('my_tasks')}
            className={`px-3.5 py-1 rounded-[28.8px] transition-all ${
              filter === 'my_tasks' ? 'bg-[#000000] text-[#ffffff]' : 'text-[#595855] hover:text-[#000000]'
            }`}
          >
            My Deliveries ({myTasks.length})
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="card-bone p-12 text-center text-[#595855]">
            <p className="font-davinci text-base text-[#000000]">No delivery requests found in this view</p>
          </div>
        ) : (
          displayed.map((task) => (
            <div
              key={task.id}
              className="card-bone p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-[28.8px] bg-[#dfdcd5] text-[#000000]">
                    ~{task.plates} Servings (~{Math.round(task.plates * 0.4)} kg)
                  </span>

                  <span className="text-[10px] font-mono uppercase text-[#000000] bg-[#ffffff] px-2.5 py-0.5 rounded-[28.8px] border border-[#dfdcd5]">
                    STATUS: {task.status.toUpperCase()}
                  </span>

                  {task.distanceKm && (
                    <span className="text-[10px] font-mono text-[#595855]">
                      · ~{task.distanceKm} km transit
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-davinci font-normal text-[#000000]">
                  {task.listingTitle}
                </h3>

                {/* Pickup and Drop Route */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs font-sans">
                  
                  <div className="p-3 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5] space-y-1">
                    <span className="text-[10px] font-mono text-[#595855] uppercase tracking-wider block">
                      A. Pickup From (Donor)
                    </span>
                    <p className="font-bold text-[#000000]">{task.donorName}</p>
                    <p className="text-[#595855] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#000000] shrink-0" />
                      {task.donorAddress}
                    </p>
                    <p className="text-[#000000] font-mono text-[11px] pt-1">
                      Phone: <a href={`tel:${task.donorPhone}`} className="underline">{task.donorPhone}</a>
                    </p>
                  </div>

                  <div className="p-3 bg-[#ffffff] rounded-[9px] border border-[#dfdcd5] space-y-1">
                    <span className="text-[10px] font-mono text-[#595855] uppercase tracking-wider block">
                      B. Deliver To (Receiver)
                    </span>
                    <p className="font-bold text-[#000000]">{task.receiverName}</p>
                    <p className="text-[#595855] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#000000] shrink-0" />
                      {task.receiverAddress}
                    </p>
                    <p className="text-[#000000] font-mono text-[11px] pt-1">
                      Phone: <a href={`tel:${task.receiverPhone}`} className="underline">{task.receiverPhone}</a>
                    </p>
                  </div>

                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                {task.status === 'open' && (
                  <button
                    onClick={() => handleAcceptTask(task)}
                    className="btn-pill flex items-center justify-center gap-2 text-xs"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Accept Delivery Request</span>
                  </button>
                )}

                {task.status === 'accepted' && (
                  <button
                    onClick={() => handleMarkPickedUp(task)}
                    className="btn-pill flex items-center justify-center gap-2 text-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Mark as Food Picked Up</span>
                  </button>
                )}

                {task.status === 'picked_up' && (
                  <button
                    onClick={() => handleMarkDelivered(task)}
                    className="btn-pill flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Confirm Handover to Receiver</span>
                  </button>
                )}

                {task.status === 'delivered' && (
                  <div className="text-xs font-mono text-[#595855] text-center p-2 bg-[#dfdcd5] rounded-[28.8px]">
                    ✓ Delivery Completed
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
