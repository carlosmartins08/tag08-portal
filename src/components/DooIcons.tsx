import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function createIcon(symbol: string) {
  const Icon = ({ size = 24, width, height, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width ?? size}
      height={height ?? size}
      aria-hidden={props["aria-hidden"] ?? true}
      focusable="false"
      {...props}
    >
      <use href={`/icons/dooicons-stroke.svg#${symbol}`} />
    </svg>
  );
  Icon.displayName = `DooIcon(${symbol})`;
  return Icon;
}

// Keep existing semantic import names while sourcing every glyph from DooIcons stroke SVGs.
export const Activity = createIcon("activity");
export const AlertCircle = createIcon("alert-circle");
export const AlertTriangle = createIcon("alert-triangle");
export const ArrowLeft = createIcon("arrow-left");
export const ArrowRight = createIcon("arrow-right");
export const ArrowUp = createIcon("arrow-up");
export const ArrowUpRight = createIcon("arrow-big-up-right");
export const Award = createIcon("award-medal");
export const BarChart = createIcon("barchart-default");
export const BarChart2 = createIcon("barchart-default");
export const BookOpen = createIcon("notebook");
export const Briefcase = createIcon("briefcase-job");
export const Building2 = createIcon("building-apartment-one");
export const Calendar = createIcon("calendar-default");
export const Camera = createIcon("camera");
export const Check = createIcon("check-tick-single");
export const CheckCircle = createIcon("check-tick-circle");
export const CheckCircle2 = createIcon("check-tick-circle");
export const CheckSquare = createIcon("check-tick-square");
export const ChevronDown = createIcon("chevron-down");
export const ChevronRight = createIcon("chevron-right");
export const ChevronUp = createIcon("chevron-up");
export const ClipboardCheck = createIcon("clipboard-check");
export const Clock = createIcon("clock-default");
export const Clock3 = createIcon("clock-default");
export const Compass = createIcon("magnetic-compass");
export const Cookie = createIcon("cookie");
export const Copy = createIcon("copy-default");
export const Cpu = createIcon("automation");
export const Database = createIcon("database");
export const ExternalLink = createIcon("external-link-square");
export const Eye = createIcon("eye-02-on");
export const Facebook = createIcon("facebook");
export const FileCheck = createIcon("file-check");
export const FileCode = createIcon("file-code");
export const FileText = createIcon("file-text");
export const Film = createIcon("film");
export const Filter = createIcon("filter-funnel");
export const FolderDot = createIcon("folder-default");
export const Gauge = createIcon("gauge-speedometer");
export const Globe = createIcon("globe");
export const GraduationCap = createIcon("graduation-hat");
export const Grid = createIcon("grid-01");
export const Heart = createIcon("heart");
export const HelpCircle = createIcon("question-mark-circle");
export const Home = createIcon("home-default");
export const Image = createIcon("photo-image-default");
export const Info = createIcon("information-circle");
export const Instagram = createIcon("instagram");
export const Key = createIcon("key-right");
export const Layers = createIcon("layers-to");
export const LineChart = createIcon("barchart-line");
export const Linkedin = createIcon("linkedin");
export const ListPlus = createIcon("list-plus");
export const Lock = createIcon("lock-02-close");
export const Mail = createIcon("envelope-default");
export const MapPin = createIcon("map-pin");
export const Menu = createIcon("burger-menu-three");
export const MessageCircle = createIcon("chat-default");
export const MessageSquare = createIcon("message-default");
export const Minus = createIcon("minus-default");
export const Monitor = createIcon("monitor-01");
export const Palette = createIcon("color-palette");
export const Percent = createIcon("discount-badge");
export const Phone = createIcon("phone");
export const Play = createIcon("play-small");
export const PlayCircle = createIcon("play-circle");
export const Plus = createIcon("plus-default");
export const Radio = createIcon("signal");
export const RefreshCw = createIcon("refresh");
export const RotateCcw = createIcon("rotate-left");
export const Scale = createIcon("scale");
export const Search = createIcon("search-default");
export const Send = createIcon("send-plane-horizontal");
export const Server = createIcon("server");
export const Settings = createIcon("settings-01");
export const Shield = createIcon("shield");
export const ShieldAlert = createIcon("shield-bug");
export const ShieldCheck = createIcon("shield-check");
export const Sliders = createIcon("settings-02");
export const Smartphone = createIcon("iphone");
export const Sparkles = createIcon("sparkle-ai-01");
export const Star = createIcon("star");
export const Target = createIcon("target-center");
export const Terminal = createIcon("terminal-console-square");
export const TrendingUp = createIcon("trendline-up");
export const Tv = createIcon("tv");
export const Type = createIcon("text");
export const User = createIcon("user-default");
export const UserCheck = createIcon("user-check");
export const Users = createIcon("people-male-female");
export const Video = createIcon("video-recording");
export const Wifi = createIcon("wifi-on");
export const Workflow = createIcon("automation");
export const X = createIcon("multiple-cross-cancel-default");
export const Youtube = createIcon("youtube");
export const Zap = createIcon("lightning-thunder-electric-on");
