/**
 * CalendarView Widget
 * Календарь с визуальной индикацией дней и модальным окном деталей
 */

"use client";

import React, { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useCalendarStore } from "@/features/progress-tracking/model/calendar-store";
import {
  fetchAndSetMonthData,
  fetchAndSetDayDetails,
} from "@/features/progress-tracking/api/calendar-api";
import { CalendarDayCell } from "@/features/progress-tracking/ui/CalendarDayCell";
import { DayDetailModal } from "@/features/progress-tracking/ui/DayDetailModal";
import { Calendar } from "@/shared/ui/shadcn/Calendar";
import { Card } from "@/shared/ui/shadcn/Card";
import { Alert } from "@/shared/ui/shadcn/Alert";
import { LoadingSpinner } from "@/shared/ui/shadcn/LoadingSpinner";

export function CalendarView() {
  const { monthData, selectedDayDetails, isLoadingMonth, isLoadingDay, monthError, dayError } =
    useCalendarStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    fetchAndSetMonthData(currentDate.year(), currentDate.month() + 1);
  }, [currentDate]);

  const handleDateClick = (date: Dayjs) => {
    fetchAndSetDayDetails(date.toDate());
    setIsModalVisible(true);
  };

  const handlePanelChange = (date: Dayjs) => {
    setCurrentDate(date);
  };

  const dateCellRender = (date: Dayjs) => {
    const dailyLog = monthData?.dailyLogs.find((log) => dayjs(log.date).isSame(date, "day"));
    return <CalendarDayCell date={date.toDate()} dailyLog={dailyLog || null} />;
  };

  return (
    <div className="space-y-4">
      <Card>
        {monthError && <Alert type="error" message={monthError} showIcon className="mb-4" />}
        {isLoadingMonth ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Загрузка календаря..." size="lg" />
          </div>
        ) : (
          <Calendar
            value={currentDate}
            cellRender={dateCellRender}
            onSelect={handleDateClick}
            onPanelChange={handlePanelChange}
          />
        )}
      </Card>

      <DayDetailModal
        visible={isModalVisible}
        dayDetails={selectedDayDetails}
        isLoading={isLoadingDay}
        error={dayError}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
}
