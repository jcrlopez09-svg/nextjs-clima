import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";
import { describeWeather } from "@/lib/weather-codes";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export function WeatherIcon({ code, isDay = true, className = "h-8 w-8" }: WeatherIconProps) {
  const { icon } = describeWeather(code);
  const Icon =
    icon === "sun"
      ? isDay ? Sun : Moon
      : icon === "cloud-sun"
        ? isDay ? CloudSun : CloudMoon
        : icon === "cloud"
          ? Cloud
          : icon === "drizzle"
            ? CloudDrizzle
            : icon === "rain"
              ? CloudRain
              : icon === "snow"
                ? CloudSnow
                : icon === "storm"
                  ? CloudLightning
                  : CloudFog;

  const tone = icon === "sun" || icon === "cloud-sun"
    ? "text-amber-300"
    : icon === "storm"
      ? "text-violet-300"
      : icon === "snow"
        ? "text-sky-200"
        : "text-cyan-200";

  return <Icon className={`${className} ${tone}`} strokeWidth={1.7} aria-hidden="true" />;
}
