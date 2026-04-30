"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock3, Lightbulb, Sparkles, X } from "lucide-react";

const MahakalClock = () => {
  const [cities] = useState([
    {
      name: "New York",
      timezone: "America/New_York",
      Descriptions: "Hot Weather",
    },
    {
      name: "London",
      timezone: "Europe/London",
      Descriptions: "Cold, windy weather",
    },
    { name: "Tokyo", timezone: "Asia/Tokyo", Descriptions: "Wet-cold weather" },
    { name: "Delhi", timezone: "Asia/Kolkata", Descriptions: " sunny weather" },
    {
      name: "Hong Kong",
      timezone: "Asia/Hong_Kong",
      Descriptions: " rainy weather",
    },
  ]);
  const [time, setTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showClockPopup, setShowClockPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [dynamicSuggestions, setDynamicSuggestions] = useState([]);
  const [apiWeather, setApiWeather] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [timeOffset, setTimeOffset] = useState(5.5);
  const [weatherDescriptions, setWeatherDescriptions] = useState([
    "Hot Weather",
    "Cold, windy weather",
    "Wet-cold weather",
  ]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthIndex = new Date().getMonth();
  const rotatedMonths = [
    ...months.slice(currentMonthIndex),
    ...months.slice(0, currentMonthIndex),
  ];
  const currentHour = time.getHours() % 12 || 12;
  const currentMinute = time.getMinutes();
  const timeZone = selectedCity || "Asia/Kolkata";
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    timeZone: timeZone,
  });
  const isAM = currentTime.includes("AM");
  const timePeriod = isAM ? "AM" : "PM";

  useEffect(() => {
    const fetchWeatherFromApi = async () => {
      const apiResponse = "cool weather";
      setApiWeather(apiResponse);
    };

    fetchWeatherFromApi();
  }, []);

  const reorderedDescriptions = [
    apiWeather,
    ...weatherDescriptions.filter((desc) => desc !== apiWeather),
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const localTime = new Date();
      const utcTime = new Date(
        localTime.getTime() + localTime.getTimezoneOffset() * 60000
      );
      const adjustedTime = new Date(utcTime.getTime() + timeOffset * 3600000);
      setTime(adjustedTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffset]);

  const handleCityChange = async (event) => {
    const selectedTimezone = event?.target?.value;
    setSelectedCity(selectedTimezone);
    cities.map((item, index) => {
      if (item.timezone === selectedTimezone) setApiWeather(item.Descriptions);
    });

    try {
      const response = await axios.get(
        `https://worldtimeapi.org/api/timezone/${selectedTimezone}`
      )
      const { utc_offset } = response.data;
      const [hours, minutes] = utc_offset.split(":").map(Number);
      const offsetHours = hours + minutes / 60;
      console.log(response)
      setTimeOffset(offsetHours);
    } catch (error) {
      console.error("Error fetching timezone data:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      });
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

      const currentWeather = response.data.current_weather;

      // Update state with simplified data
      console.log("Weather information : ",currentWeather)
      setWeatherData({
        temperature: currentWeather.temperature,
        windspeed: currentWeather.windspeed,
        winddirection: currentWeather.winddirection,
        time: currentWeather.time,
      });
      console.log(currentWeather)
    } catch (error) {
      console.error("Error fetching weather data from Open-Meteo:", error);
    }
  };

  useEffect(() => {
    if (weatherData) {
      const currentHour = time.getHours();
      const suggestions = generateWeatherSuggestions(currentHour, weatherData);
      setSuggestions(suggestions);
    }
  }, [time, weatherData]);


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closeWeatherPopup = () => {
    setShowPopup(false);
  };

  const closePopup = () => {
    setShowClockPopup(false);
  };

  const handleHourClick = (hour) => {
    const content = `You clicked on hour ${hour}.`;
    const suggestions = generateTimeSuggestions(hour);
    setPopupContent(content);
    setDynamicSuggestions(suggestions);
    setShowClockPopup(true);
  };

  const handleMinuteClick = (minute) => {
    const content = `You clicked on minute ${minute}.`;
    setPopupContent(content);
    setDynamicSuggestions([`Current minute selected: ${minute}.`]);
    setShowClockPopup(true);
  };

  const handleWeatherChange = () => {
    setWeatherDescriptions((prev) => {
      const updated = [...prev];
      const topDescription = updated.shift();
      updated.push(topDescription);
      return updated;
    });
  };

  const generateTimeSuggestions = (hour) => {
    let suggestions = [];
    if (hour >= 6 && hour < 12) {
      suggestions.push("Morning walk", "Breakfast tips", "Morning exercises");
    } else if (hour >= 12 && hour < 18) {
      suggestions.push("Lunchtime recipes", "Afternoon productivity hacks");
    } else if (hour >= 18 || hour < 6) {
      suggestions.push(
        "Dinner ideas",
        "Relaxing evening activities",
        "Sleep hygiene tips"
      );
    }
    return suggestions;
  };

  const generateWeatherSuggestions = (hour, weatherData) => {
    const suggestions = [];

    if (hour >= 6 && hour < 12) {
      suggestions.push("Morning exercise is recommended.");
    }

    if (weatherData?.temperature > 30) {
      suggestions.push("Stay hydrated! The temperature is quite high.");
    } else if (weatherData?.temperature > 20) {
      suggestions.push("Temperature: Starts cool and gradually warms up");
    } else if (weatherData?.temperature <= 20) {
      suggestions.push("It's quite cool, consider a light jacket.");
    }

    if (weatherData?.windspeed > 20) {
      suggestions.push("Windy day - secure loose items and avoid biking.");
    }

    return suggestions;
  };


  const calculatePosition = (angle, radius) => {
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    return { x, y };
  };

  const hourAngle = ((time.getHours() % 12) + time.getMinutes() / 60) * 30 - 90;
  const minuteAngle = (time.getMinutes() + time.getSeconds() / 60) * 6 - 90;
  const secondAngle = time.getSeconds() * 6 - 90;

  return (
    <div className="text-center" style={{ backgroundColor: "#1d160d", minHeight: "200vh", padding: "350px" }}>
      <svg viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Ring with Gradient for Months */}
        <defs>
          <linearGradient id="monthGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#ff7f50" />
            <stop offset="100%" stopColor="#1e90ff" />
          </linearGradient>
        </defs>
        {/* Define paths for months to follow the circle */}
        <defs>
          <path
            id="topTextPath"
            d="M -280 0 A 280 280 0 1 1 280 0 A 280 280 0 1 1 -280 0"
          />
        </defs>
        {/* Month names placed along the circle path */}
        <g transform="rotate(-278)">
          {rotatedMonths.map((month, index) => {
            const angle = (index * 360) / 12 - 46;
            const isCurrentMonth = index === 0;

            const dotRadius = 280;
            const dotPositions = [];
            for (let i = 1; i <= 3; i++) {
              const dotAngle = angle + i * 2;
              const dotX = dotRadius * Math.cos((dotAngle * Math.PI) / 180);
              const dotY = dotRadius * Math.sin((dotAngle * Math.PI) / 180);
              dotPositions.push({ x: dotX, y: dotY });
            }
            return (
              <React.Fragment key={index}>
                <text
                  fontSize="14"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`mahakal-month-${index}`}
                  fill={isCurrentMonth ? "#2E8766" : "#fff"}
                  fontWeight={isCurrentMonth ? "bold" : "normal"}
                >
                  <textPath
                    href="#topTextPath"
                    startOffset={`${(index * 100) / 12 + 1.7}%`}
                  >
                    {month}
                  </textPath>
                </text>

                {/* 3 Round Dots after each month */}
                {dotPositions.map((dot, dotIndex) => (
                  <circle
                    key={`${index}-${dotIndex}`}
                    cx={dot.x}
                    cy={dot.y}
                    r="2"
                    fill="#fff"
                  />
                ))}
              </React.Fragment>
            );
          })}
        </g>

        {/* Solid circle line */}
        <circle
          cx="0"
          cy="0"
          r="220"
          stroke="gray"
          strokeWidth="1"
          fill="none"
        />

        <defs>
          <path
            id="topTextPaths"
            d="M -220 0 A 220 220 0 1 1 220 0 A 220 220 0 1 1 -220 0"
          />
          <path
            id="bottomRightTextPath"
            d="M -220 0 A 150 220 0 1 1 220 0 A 220 220 0 1 1 -220 0"
          />
          <path
            id="bottomLeftTextPath"
            d="M -220 0 A 220 220 0 1 1 220 0 A 220 220 0 1 1 -220 0"
          />
        </defs>

        {/* Top Text */}
        <rect
          x="-28"
          y="-229"
          width="150"
          height="31"
          fill="#1d160d"
          transform="rotate(-3, -155, 700)"
        ></rect>
        <text fontSize="14" fill="#ccc">
          <textPath
            href="#topTextPaths"
            startOffset="25%"
            textAnchor="middle"
            fill="#2E8766"
            style={{ cursor: "pointer", fontStyle: "italic" }}
          >
            {reorderedDescriptions[0] || "Loading..."}
          </textPath>
        </text>

        {/* Bottom Right Text */}
        <rect
          x="83"
          y="-23"
          width="137"
          height="24.5"
          fill="#1d160d"
          transform="rotate(107, 150, 50)"
        />
        <text fontSize="14" fill="#ccc">
          <textPath
            href="#bottomRightTextPath"
            startOffset="60%"
            textAnchor="middle"
            style={{ cursor: "pointer", fontStyle: "italic" }}
          >
            {reorderedDescriptions[1]}
          </textPath>
        </text>

        {/* Bottom Left Text */}
        <rect
          x="-207"
          y="91"
          width="130"
          height="28"
          fill="#1d160d"
          transform="rotate(70, -160, 60)"
        />
        <text fontSize="14" fill="#ccc">
          <textPath
            href="#bottomLeftTextPath"
            startOffset="93%"
            textAnchor="middle"
            style={{ cursor: "pointer", fontStyle: "italic" }}
          >
            {reorderedDescriptions[2]}
          </textPath>
        </text>
        <defs>
          <path
            id="topPaths"
            d="M -180 0 A 180 180 0 1 1 180 0 A 180 180 0 1 1 -180 0"
          />
          <path
            id="rightTextPath"
            d="M -180 0 A 180 180 0 1 1 180 0 A 180 180 0 1 1 -180 0"
          />
          <path
            id="leftTextPath"
            d="M -180 0 A 180 180 0 1 1 180 0 A 180 180 0 1 1 -180 0"
          />
        </defs>

        {/* Top Text */}
        {/* <rect
          x="-0"
          y="-0"
          width="150"
          height="31"
          fill=""
          transform="rotate(-3, -155, 700)"
        ></rect> */}
        <text fontSize="14" fill="#ccc">
          <textPath
            href="#topPaths"
            startOffset="25%"
            textAnchor="middle"
            fill="#fff"
            style={{ cursor: "pointer", fontStyle: "italic" }}
          >
            Water PITTA Fire
          </textPath>
        </text>

        <text fontSize="14" fill="#ccc" className="Text_path_2">
          <textPath
            href="#rightTextPath"
            startOffset="60%"
            textAnchor="middle"
            style={{ cursor: "pointer", fontStyle: "italic" }}
          >
            Earth VATTA Air
          </textPath>
        </text>

        {/* Bottom Left Text */}
        <text fontSize="14" fill="#ccc" className="Text_path_3">
          <textPath
            href="#leftTextPath"
            startOffset="93%"
            textAnchor="middle"
            style={{ cursor: "pointer", fontStyle: "italic" }}
          >
            Earth CAPHA Water
          </textPath>
        </text>
        {/* last */}
        <circle
            cx="0"
            cy="0"
            r="95"
            stroke="#333"
            strokeWidth="4"
            fill="#f8f8f8"
          />

        {/* Inner Ring for Current Time with Decorative Border */}
        <circle
          cx="0"
          cy="0"
          r="60"
          stroke="#8a2be2"
          strokeWidth="6"
          fill="#e0e0e0"
        />

        {/* Hour Hand */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-40"
          stroke="#333"
          strokeWidth="4"
          transform={`rotate(${30 * (time.getHours() % 12) + time.getMinutes() / 2
            })`}
        />

        {/* Minute Hand */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-60"
          stroke="#666"
          strokeWidth="2"
          transform={`rotate(${6 * time.getMinutes()})`}
        />

        {/* Second Hand */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="-70"
          stroke="#e63946"
          strokeWidth="1"
          transform={`rotate(${6 * time.getSeconds()})`}
        />

        {/* Numbers around the clock face */}
        {[...Array(12).keys()].map((i) => {
          const hour = i + 1;
          const angle = hour * 30;
          const x = 130 * Math.sin((angle * Math.PI) / 180);
          const y = -130 * Math.cos((angle * Math.PI) / 180);
          const isCurrentHour = hour === currentHour;

          return (
            <text
              style={{ cursor: "pointer" }}
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              fill={isCurrentHour ? "#2E8766" : "#ccc"}
              fontWeight={isCurrentHour ? "bolder" : "normal"}
              onClick={() => handleHourClick(hour)}
            >
              {hour}
            </text>
          );
        })}

        {/* AM/PM Display */}
        <text
          x={30}
          y={-130}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fill={isAM ? "#fff" : "#2E8766"}
          fontWeight="bold"
        >
          {timePeriod}
        </text>

        {/* Minute Markers (Dots and Lines for Hours) */}
        {[...Array(60).keys()].map((i) => {
          const angle = i * 6;
          const isHourMarker = i % 5 === 0;
          const x1 =
            (isHourMarker ? 110 : 120) * Math.sin((angle * Math.PI) / 180);
          const y1 =
            -(isHourMarker ? 110 : 120) * Math.cos((angle * Math.PI) / 180);
          const x2 = 120 * Math.sin((angle * Math.PI) / 180);
          const y2 = -120 * Math.cos((angle * Math.PI) / 180);
          const isCurrentMinute = i === currentMinute;

          return isHourMarker ? (
            <line
              key={`minute-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isCurrentMinute ? "#2E8766" : "#aaa"}
              strokeWidth={isCurrentMinute ? 3 : 2}
              onClick={() => handleMinuteClick(i)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <circle
              key={`minute-${i}`}
              cx={x2}
              cy={y2}
              r={isCurrentMinute ? 3 : 2}
              fill={isCurrentMinute ? "#2E8766" : "#aaa"}
              onClick={() => handleMinuteClick(i)}
              style={{ cursor: "pointer" }}
            />
          );
        })}

        {/* Clock Hands */}
        {/* <line
          x1="0"
          y1="0"
          x2={calculatePosition(hourAngle, 50).x}
          y2={calculatePosition(hourAngle, 50).y}
          stroke="black"
          strokeWidth="8"
        /> */}
        <line
          x1="0"
          y1="0"
          x2={calculatePosition(minuteAngle, 70).x}
          y2={calculatePosition(minuteAngle, 70).y}
          stroke="black"
          strokeWidth="4"
        />

     {/* Center Image */}
        <image
          href="/wallpaper/Shape2.png"
          x="-100"
          y="-102"
          width="200"
          height="200"
          clipPath="circle(50%)"
          className="rotating-image"
        />

        <image
          href="/wallpaper/Ellipse9.png"
          x="-65"
          y="-66"
          width="130"
          height="130"
          clipPath="circle(50%)"
        />

        <image
          className="water-img-1"
          href="/wallpaper/img-1.svg"
          x="-95"
          y="-180"
          width="30"
        />
        <image
          className="water-img-1"
          href="/wallpaper/img-2.svg"
          x="-200"
          y="-25"
          width="30"
        />
        <image
          className="water-img-2"
          href="/wallpaper/img-3.svg"
          x="-125"
          y="135"
          width="30"
        />
        <image
          className="water-img-3"
          href="/wallpaper/img-5.svg"
          x="70"
          y="-180"
          width="30"
        />
        <image
          className="water-img-4"
          href="/wallpaper/img-6.svg"
          x="170"
          y="25"
          width="30"
        />
        <image
          className="water-img-4"
          href="/wallpaper/img-6.svg"
          x="75"
          y="145"
          width="30"
        />
        <image
          className="water-img-5"
          href="/wallpaper/001.png"
          x="170"
          y="20"
          width="30"
        />
      </svg>
          
      {/* Suggestions box with a decorative border */}
      {showPopup && (
        <div className="suggestions-box mt-5 p-3 border-2 border-dashed border-purple-600 max-w-xs mx-auto text-left">
          <h3 className="text-white">Weather Report</h3>
          <button onClick={closeWeatherPopup} className="float-right">
            X
          </button>
          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-white">{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p>No suggestions available at the moment.</p>
          )}
        </div>
      )}

      {showClockPopup && (
        <div className="mahakal-popup-backdrop" onClick={closePopup}>
          <div className="mahakal-popup-card" onClick={(event) => event.stopPropagation()}>
            <div className="mahakal-popup-header">
              <div className="mahakal-popup-title-group">
                <span className="mahakal-popup-icon">
                  <Clock3 size={22} />
                </span>
                <div>
                  <p className="mahakal-popup-eyebrow">Time Suggestions</p>
                  <h2>Smart routine ideas</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="mahakal-popup-close"
                aria-label="Close suggestions popup"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mahakal-popup-body">
              <div className="mahakal-popup-selected-time">
                <Sparkles size={18} />
                {popupContent}
              </div>

              <div className="mahakal-popup-section-heading">
                <Lightbulb size={20} />
                <h3>Suggestions</h3>
              </div>

              <ul className="mahakal-suggestion-list">
                {dynamicSuggestions.length > 0 ? (
                  dynamicSuggestions.map((suggestion, index) => (
                    <li key={index}>
                      <span>{index + 1}</span>
                      <p>{suggestion}</p>
                    </li>
                  ))
                ) : (
                  <li>
                    <span>1</span>
                    <p>No suggestions available for this hour.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="text-center p-5">
        <div className="clock-card-sec">
          <h1 className="text-3xl font-bold text-white">Mahakal Clock</h1>
        </div>
        <div className="clock-time-sec">
          <h2 className="text-2xl text-white">{time.toLocaleTimeString()}</h2>
        </div>
        <div className="clock-select-city-se">
          <div className="mt-3">
            <label className="text-white">Select a City: </label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="p-2 border rounded"
            >
              <option value="">Select...</option>
              {cities.map((city) => (
                <option key={city?.timezone} value={city?.timezone}>
                  {city?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="clock-time-sec my-3">
          <p className="text-white">
            Showing time for: {selectedCity || "Local Time "} <button onClick={() => togglePopup()}>Weather</button>
          </p>
          
        </div>
        
      </div>
    </div>
  );
};

export default MahakalClock;

