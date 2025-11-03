/**
 * CalendarView Widget
 * Календарь с визуальной индикацией дней и модальным окном деталей
 */

"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Spin, Alert, Card } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useCalendarStore } from "@/features/progress-tracking/model/calendar-store";
import {
  fetchAndSetMonthData,
  fetchAndSetDayDetails,
} from "@/features/progress-tracking/api/calendar-api";
import { CalendarDayCell } from "@/features/progress-tracking/ui/CalendarDayCell";
import { DayDetailModal } from "@/features/progress-tracking/ui/DayDetailModal";

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
    <div>
      <Card>
        {monthError && (
          <Alert message={monthError} type="error" showIcon style={{ marginBottom: 16 }} />
        )}
        {isLoadingMonth ? (
          <Spin tip="Загрузка календаря..." />
        ) : (
          <Calendar
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
