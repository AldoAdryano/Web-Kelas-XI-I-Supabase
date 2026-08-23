import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from "../lib/supabase";

const Schedule = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDayIndex = new Date().getDay();
  const currentDay = daysOfWeek[currentDayIndex];

  const [schedules, setSchedules] = useState([]);
  const [pikets, setPikets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();
    AOS.refresh();

    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        // Fetch schedules for current day
        const { data: scheduleData, error: scheduleError } = await supabase
          .from("schedules")
          .select("*")
          .eq("day_id", currentDayIndex)
          .order("order_index", { ascending: true });
        
        if (scheduleError) throw scheduleError;
        setSchedules(scheduleData || []);

        // Fetch piket for current day
        const { data: piketData, error: piketError } = await supabase
          .from("piket")
          .select("*")
          .eq("day_id", currentDayIndex)
          .order("order_index", { ascending: true });
        
        if (piketError) throw piketError;
        setPikets(piketData || []);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentDayIndex >= 1 && currentDayIndex <= 6) {
      fetchScheduleData();
    } else {
      setLoading(false); // Sunday
    }
  }, [currentDayIndex]);

  return (
    <>
      {/* Jadwal Mapel */}
      <div className="lg:flex lg:justify-center lg:gap-32 lg:mb-10 lg:mt-16 ">
        <div className="text-white flex flex-col justify-center items-center mt-8 md:mt-3 overflow-y-hidden">
          <div
            className="text-2xl font-medium mb-5"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            {currentDay}
          </div>
          <div data-aos="fade-up" data-aos-duration="400">
            {loading ? (
              <p className="opacity-50">Loading...</p>
            ) : schedules.length > 0 ? (
              schedules.map((item, index) => (
                <div key={item.id} className="border-t-2 border-b-2 border-white flex justify-between py-[0.50rem] w-72 px-3" data-aos="fade-up" data-aos-duration={600 + index * 100}>
                  <div className="w-[50%] text-base font-medium">{item.subject}</div>
                  <div className="flex justify-center items-center text-sm">{item.time_start}-{item.time_end}</div>
                </div>
              ))
            ) : (
              <p className="opacity-50">Tidak Ada Jadwal Hari Ini</p>
            )}
          </div>
        </div>
      </div>

      {/* Jadwal Piket */}
      <div className="text-white flex flex-col justify-center items-center mt-8 lg:mt-0 overflow-y-hidden">
        <div
          className="text-2xl font-medium mb-5 text-center"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          Piket
        </div>
        {loading ? (
          <p className="opacity-50">Loading...</p>
        ) : pikets.length > 0 ? (
          pikets.map((item, index) => (
            <div
              key={item.id}
              className={` border-t-2 border-white flex justify-center py-[0.50rem] w-72 px-3 ${
                index === pikets.length - 1 ? "border-b-2" : ""
              }`}
              data-aos="fade-up"
              data-aos-duration={600 + index * 100}
            >
              <div className="text-base font-medium">{item.student_name}</div>
            </div>
          ))
        ) : (
          <p className="opacity-50">Tidak ada Jadwal Piket Hari Ini</p>
        )}
      </div>
    </>
  );
};

export default Schedule;
