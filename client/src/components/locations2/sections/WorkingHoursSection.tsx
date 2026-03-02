import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { LocationFormData, WorkingHoursDay } from '@/lib/types/location-form';

interface WorkingHoursSectionProps {
  form: UseFormReturn<LocationFormData>;
}

type TabType = 'normal' | 'special';

export default function WorkingHoursSection({ form }: WorkingHoursSectionProps) {
  const { t } = useTranslation();
  const oc = t.locationForms as any;
  const hr = oc?.hours;

  const [activeTab, setActiveTab] = useState<TabType>('normal');
  const [selectedDay, setSelectedDay] = useState(0);

  const locationStatus = form.watch('locationStatus');
  const workingHours = form.watch('workingHours');
  const isDisabled =
    locationStatus === 'permanently_closed' || locationStatus === 'temporarily_closed';

  const selectedDayData = workingHours[selectedDay];

  // Update a single field on the selected day
  const updateDayField = <K extends keyof WorkingHoursDay>(
    dayIdx: number,
    field: K,
    value: WorkingHoursDay[K]
  ) => {
    const updated = workingHours.map((d, i) => (i === dayIdx ? { ...d, [field]: value } : d));
    form.setValue('workingHours', updated, { shouldDirty: true });
  };

  // Add a break to the selected day
  const addBreak = () => {
    const updated = workingHours.map((d, i) =>
      i === selectedDay
        ? { ...d, breaks: [...d.breaks, { start: '', end: '' }] }
        : d
    );
    form.setValue('workingHours', updated, { shouldDirty: true });
  };

  // Remove a break from the selected day
  const removeBreak = (breakIdx: number) => {
    const updated = workingHours.map((d, i) =>
      i === selectedDay
        ? { ...d, breaks: d.breaks.filter((_, bi) => bi !== breakIdx) }
        : d
    );
    form.setValue('workingHours', updated, { shouldDirty: true });
  };

  // Update a break time field
  const updateBreak = (breakIdx: number, field: 'start' | 'end', value: string) => {
    const updated = workingHours.map((d, i) =>
      i === selectedDay
        ? {
            ...d,
            breaks: d.breaks.map((b, bi) =>
              bi === breakIdx ? { ...b, [field]: value } : b
            ),
          }
        : d
    );
    form.setValue('workingHours', updated, { shouldDirty: true });
  };

  const inputClass =
    'px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">
          {oc?.sections?.hours || 'Working Hours'}
        </h3>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-5">

          {/* Location Status radios */}
          <div>
            <label className={labelClass}>{hr?.locationStatus || 'Location Status'}</label>
            <div className="flex items-center gap-6">
              {[
                { value: 'open', label: hr?.open || 'Open' },
                { value: 'temporarily_closed', label: hr?.temporarilyClosed || 'Temporarily Closed' },
                { value: 'permanently_closed', label: hr?.permanentlyClosed || 'Permanently Closed' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...form.register('locationStatus')}
                    value={opt.value}
                    className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Normal / Special hours tabs */}
          <div>
            <div className="flex border-b border-gray-200 mb-4">
              {([
                { id: 'normal' as const, label: hr?.normalHours || 'Normal Hours' },
                { id: 'special' as const, label: hr?.specialHours || 'Special Hours' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'special' ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">
                Özel saatler yakında eklenecek
              </p>
            ) : (
              <div className={cn(isDisabled && 'opacity-50 pointer-events-none')}>

                {/* Day pill buttons */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {workingHours.map((day, idx) => (
                    <button
                      key={day.day}
                      type="button"
                      onClick={() => setSelectedDay(idx)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                        selectedDay === idx
                          ? 'bg-blue-500 text-white border-blue-500'
                          : day.isOpen
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                      )}
                    >
                      {day.dayLabel}
                    </button>
                  ))}
                </div>

                {/* Selected day detail */}
                {selectedDayData && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    {/* Open/closed toggle for the day */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedDayData.dayLabel}
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDayData.isOpen}
                          onChange={(e) => updateDayField(selectedDay, 'isOpen', e.target.checked)}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{hr?.open || 'Open'}</span>
                      </label>
                    </div>

                    {selectedDayData.isOpen && (
                      <>
                        {/* Time inputs */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>
                              {hr?.openingTime || 'Opening Time'}
                            </label>
                            <input
                              type="time"
                              value={selectedDayData.openTime}
                              onChange={(e) =>
                                updateDayField(selectedDay, 'openTime', e.target.value)
                              }
                              disabled={selectedDayData.is24Hours}
                              className={cn(inputClass, 'w-full', selectedDayData.is24Hours && 'opacity-40 cursor-not-allowed')}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              {hr?.closingTime || 'Closing Time'}
                            </label>
                            <input
                              type="time"
                              value={selectedDayData.closeTime}
                              onChange={(e) =>
                                updateDayField(selectedDay, 'closeTime', e.target.value)
                              }
                              disabled={selectedDayData.is24Hours}
                              className={cn(inputClass, 'w-full', selectedDayData.is24Hours && 'opacity-40 cursor-not-allowed')}
                            />
                          </div>
                        </div>

                        {/* 24 hours checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedDayData.is24Hours}
                            onChange={(e) =>
                              updateDayField(selectedDay, 'is24Hours', e.target.checked)
                            }
                            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {hr?.open24h || 'Open 24 Hours'}
                          </span>
                        </label>

                        {/* Break rows */}
                        {selectedDayData.breaks.map((brk, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-3">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <input
                                type="time"
                                value={brk.start}
                                onChange={(e) => updateBreak(bIdx, 'start', e.target.value)}
                                className={cn(inputClass, 'w-full')}
                                placeholder="Break start"
                              />
                              <input
                                type="time"
                                value={brk.end}
                                onChange={(e) => updateBreak(bIdx, 'end', e.target.value)}
                                className={cn(inputClass, 'w-full')}
                                placeholder="Break end"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBreak(bIdx)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {/* Add break link */}
                        <button
                          type="button"
                          onClick={addBreak}
                          className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          + {hr?.addBreak || 'Add Break'}
                        </button>
                      </>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
