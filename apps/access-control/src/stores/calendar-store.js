import { t } from "i18next";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

// ----------------------------------------------------------------------

export const useCalendarStore = create()(
    immer((set) => ({
        weekDays: [
            {
                dayOfWeek: "Sunday",
                isWorkDay: false,
                shifts: []
            },
            {
                dayOfWeek: "Monday",
                isWorkDay: false,
                shifts: []
            },
            {
                dayOfWeek: "Tuesday",
                isWorkDay: false,
                shifts: []
            },
            {
                dayOfWeek: "Wednesday",
                isWorkDay: false,
                shifts: []
            },
            {
                dayOfWeek: "Thursday",
                isWorkDay: false,
                shifts: []
            },
            {
                dayOfWeek: "Friday",
                isWorkDay: false,
                shifts: []
            },
            {
                dayOfWeek: "Saturday",
                isWorkDay: false,
                shifts: []
            },

        ],
        holidays: [],
        addHoliday: (holiday) => set((state) => {
            if (state.holidays.some(a => (JSON.stringify(a.date) === JSON.stringify(holiday.date)))) {
                throw new Error(t('user:toastMessages.sameTime'));
            }
            state.holidays.push(holiday);
        }),
        removeHoliday: (date) => set((state) => {
            state.holidays = state.holidays.filter(h => h.date !== date);
        }),
        resetHolidays: () => set(() => ({ holidays: [] })),
        addShift: (weekDay, shift) => set((state) => {
            console.log(weekDay);
            if (state.weekDays[weekDay].shifts.some(a => (JSON.stringify(a.startTime) === JSON.stringify(shift.startTime) && JSON.stringify(a.endTime) === JSON.stringify(shift.endTime) && JSON.stringify(a.breakStart) === JSON.stringify(shift.breakStart) && JSON.stringify(a.breakEnd) === JSON.stringify(shift.breakEnd)))) {
                throw new Error(t('user:toastMessages.sameTime'));
            }
            else if (state.weekDays[weekDay].shifts.some(a => (JSON.stringify(a.shiftNumber) === JSON.stringify(shift.shiftNumber)))) {
                throw new Error(t('device:toastMessages.sameShiftNumber'));
            }
            state.weekDays[weekDay].shifts.push(shift);
            state.weekDays[weekDay].isWorkDay = true;
        }),
        removeShift: (dayOfWeek, shiftNumber) => set((state) => {
            const weekDay = state.weekDays.find((day) => day.dayOfWeek === dayOfWeek);

            weekDay.shifts = weekDay.shifts.filter((s) => s.shiftNumber !== shiftNumber);
            if (weekDay.shifts.length === 0) {
                weekDay.isWorkDay = false;
            }
        }),
        setWeekDays: (weekDays) => set((state) => {
            state.weekDays = weekDays;
        }),
        setHolidays: (holidays) => set((state) => {
            state.holidays = holidays;
        }),
        resetWeekDays: () =>
            set(() => ({
                weekDays: [
                    {
                        dayOfWeek: "Sunday",
                        isWorkDay: false,
                        shifts: [],
                    },
                    {
                        dayOfWeek: "Monday",
                        isWorkDay: false,
                        shifts: [],
                    },
                    {
                        dayOfWeek: "Tuesday",
                        isWorkDay: false,
                        shifts: [],
                    },
                    {
                        dayOfWeek: "Wednesday",
                        isWorkDay: false,
                        shifts: [],
                    },
                    {
                        dayOfWeek: "Thursday",
                        isWorkDay: false,
                        shifts: [],
                    },
                    {
                        dayOfWeek: "Friday",
                        isWorkDay: false,
                        shifts: [],
                    },
                    {
                        dayOfWeek: "Saturday",
                        isWorkDay: false,
                        shifts: [],
                    },
                ],
            }))
    })));