import sceneClassroom from "@/assets/scene-classroom.jpg";
import charMaya from "@/assets/char-maya.jpg";
import charRahul from "@/assets/char-rahul.jpg";
import charAlex from "@/assets/char-alex.jpg";
import bgClassroom from "@/assets/bg-classroom.jpg";
import bgLab from "@/assets/bg-lab.jpg";
import bgDelhi from "@/assets/bg-delhi.jpg";
import bgApartment from "@/assets/bg-apartment.jpg";
import propDevice from "@/assets/prop-device.jpg";
import propLaptop from "@/assets/prop-laptop.jpg";
import propBooks from "@/assets/prop-books.jpg";
import coverMaya from "@/assets/cover-maya.jpg";
import coverDelhi from "@/assets/cover-delhi.jpg";
import coverSignal from "@/assets/cover-signal.jpg";

export const images = {
  sceneClassroom,
  charMaya,
  charRahul,
  charAlex,
  bgClassroom,
  bgLab,
  bgDelhi,
  bgApartment,
  propDevice,
  propLaptop,
  propBooks,
  coverMaya,
  coverDelhi,
  coverSignal,
};

export type AssetKind = "character" | "background" | "prop" | "voice" | "audio";

export type Asset = {
  id: string;
  name: string;
  kind: AssetKind;
  role: string;
  style: string;
  tags: string[];
  uses: number;
  image?: string;
};

export type SceneStatus = "draft" | "generating" | "ready" | "review" | "failed";
export type EpisodeStatus = "complete" | "in-progress" | "draft";

export type Scene = {
  id: string;
  episodeId: string;
  number: number;
  title: string;
  summary: string;
  duration: string;
  status: SceneStatus;
  camera: string;
  thumb: string;
  assetIds: string[];
};

export type Episode = {
  id: string;
  projectId: string;
  number: number;
  title: string;
  status: EpisodeStatus;
  duration: string;
  edited: string;
  thumb: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  episodes: number;
  edited: string;
  status: "Active" | "Draft" | "Archived";
  style: string;
  ratio: string;
  cover: string;
};

export const assets: Asset[] = [
  {
    id: "maya",
    name: "Maya",
    kind: "character",
    role: "Teacher",
    style: "Stylized 3D",
    tags: ["female", "lead", "rigged"],
    uses: 42,
    image: charMaya,
  },
  {
    id: "rahul",
    name: "Rahul",
    kind: "character",
    role: "Student",
    style: "Stylized 3D",
    tags: ["male", "supporting", "rigged"],
    uses: 28,
    image: charRahul,
  },
  {
    id: "alex",
    name: "Alex",
    kind: "character",
    role: "Student",
    style: "Stylized 3D",
    tags: ["male", "supporting", "rigged"],
    uses: 19,
    image: charAlex,
  },
  {
    id: "bg-classroom",
    name: "Classroom",
    kind: "background",
    role: "Interior",
    style: "Stylized 3D",
    tags: ["school", "daylight"],
    uses: 34,
    image: bgClassroom,
  },
  {
    id: "bg-lab",
    name: "Science Lab",
    kind: "background",
    role: "Interior",
    style: "Stylized 3D",
    tags: ["science", "cool light"],
    uses: 17,
    image: bgLab,
  },
  {
    id: "bg-delhi",
    name: "Delhi Street",
    kind: "background",
    role: "Exterior",
    style: "Stylized 3D",
    tags: ["city", "golden hour"],
    uses: 11,
    image: bgDelhi,
  },
  {
    id: "bg-apartment",
    name: "Maya's Apartment",
    kind: "background",
    role: "Interior",
    style: "Stylized 3D",
    tags: ["home", "night"],
    uses: 9,
    image: bgApartment,
  },
  {
    id: "prop-device",
    name: "Broken Device",
    kind: "prop",
    role: "Hero prop",
    style: "Stylized 3D",
    tags: ["electronics", "story"],
    uses: 12,
    image: propDevice,
  },
  {
    id: "prop-laptop",
    name: "Laptop",
    kind: "prop",
    role: "Set dressing",
    style: "Stylized 3D",
    tags: ["tech"],
    uses: 21,
    image: propLaptop,
  },
  {
    id: "prop-desk",
    name: "Desk",
    kind: "prop",
    role: "Set dressing",
    style: "Stylized 3D",
    tags: ["furniture"],
    uses: 30,
    image: propBooks,
  },
  {
    id: "prop-books",
    name: "Books",
    kind: "prop",
    role: "Set dressing",
    style: "Stylized 3D",
    tags: ["school"],
    uses: 16,
    image: propBooks,
  },
  {
    id: "prop-whiteboard",
    name: "Whiteboard",
    kind: "prop",
    role: "Set dressing",
    style: "Stylized 3D",
    tags: ["school"],
    uses: 8,
  },
  {
    id: "prop-phone",
    name: "Phone",
    kind: "prop",
    role: "Set dressing",
    style: "Stylized 3D",
    tags: ["tech"],
    uses: 14,
  },
  {
    id: "prop-mug",
    name: "Coffee Mug",
    kind: "prop",
    role: "Set dressing",
    style: "Stylized 3D",
    tags: ["home"],
    uses: 6,
  },
  {
    id: "voice-maya",
    name: "Maya Voice",
    kind: "voice",
    role: "Female · Warm",
    style: "English (IN)",
    tags: ["lead", "calm"],
    uses: 38,
  },
  {
    id: "voice-rahul",
    name: "Rahul Voice",
    kind: "voice",
    role: "Male · Young",
    style: "English (IN)",
    tags: ["supporting"],
    uses: 22,
  },
  {
    id: "voice-alex",
    name: "Alex Voice",
    kind: "voice",
    role: "Male · Bright",
    style: "English (US)",
    tags: ["supporting"],
    uses: 10,
  },
  {
    id: "audio-classroom",
    name: "Classroom Ambience",
    kind: "audio",
    role: "Ambience",
    style: "Loop · 2:00",
    tags: ["room tone"],
    uses: 13,
  },
  {
    id: "audio-theme",
    name: "Series Theme",
    kind: "audio",
    role: "Music",
    style: "Stinger · 0:12",
    tags: ["intro"],
    uses: 7,
  },
];

export const assetById = (id: string) => assets.find((a) => a.id === id);

export const projects: Project[] = [
  {
    id: "professor-maya",
    name: "Professor Maya",
    description: "An educational animated YouTube series about science and technology.",
    episodes: 6,
    edited: "2 hours ago",
    status: "Active",
    style: "3D Stylized",
    ratio: "YouTube 16:9",
    cover: coverMaya,
  },
  {
    id: "life-at-30",
    name: "Life at 30",
    description: "Slice-of-life comedy shorts about growing up late.",
    episodes: 4,
    edited: "Yesterday",
    status: "Active",
    style: "2D Cartoon",
    ratio: "Shorts 9:16",
    cover: bgApartment,
  },
  {
    id: "delhi-stories",
    name: "Delhi Stories",
    description: "An anthology of short animated city stories.",
    episodes: 3,
    edited: "4 days ago",
    status: "Draft",
    style: "Cinematic",
    ratio: "YouTube 16:9",
    cover: coverDelhi,
  },
  {
    id: "the-last-signal",
    name: "The Last Signal",
    description: "A sci-fi mini-series about a transmission from the dark.",
    episodes: 2,
    edited: "Last week",
    status: "Draft",
    style: "Anime",
    ratio: "YouTube 16:9",
    cover: coverSignal,
  },
];

export const episodes: Episode[] = [
  {
    id: "ep-01",
    projectId: "professor-maya",
    number: 1,
    title: "The First Signal",
    status: "complete",
    duration: "4:12",
    edited: "3 weeks ago",
    thumb: bgClassroom,
  },
  {
    id: "ep-02",
    projectId: "professor-maya",
    number: 2,
    title: "Into the Lab",
    status: "complete",
    duration: "5:38",
    edited: "2 weeks ago",
    thumb: bgLab,
  },
  {
    id: "ep-03",
    projectId: "professor-maya",
    number: 3,
    title: "The Missing Signal",
    status: "in-progress",
    duration: "3:20",
    edited: "2 hours ago",
    thumb: sceneClassroom,
  },
  {
    id: "ep-04",
    projectId: "professor-maya",
    number: 4,
    title: "The Experiment",
    status: "draft",
    duration: "—",
    edited: "5 days ago",
    thumb: bgLab,
  },
  {
    id: "ep-05",
    projectId: "delhi-stories",
    number: 1,
    title: "Last Metro Home",
    status: "in-progress",
    duration: "2:44",
    edited: "4 days ago",
    thumb: bgDelhi,
  },
  {
    id: "ep-06",
    projectId: "life-at-30",
    number: 1,
    title: "Rent Day",
    status: "complete",
    duration: "1:02",
    edited: "Yesterday",
    thumb: bgApartment,
  },
];

export const scenes: Scene[] = [
  {
    id: "sc-01",
    episodeId: "ep-03",
    number: 1,
    title: "Classroom entrance",
    summary: "Maya enters the classroom",
    duration: "06.2s",
    status: "ready",
    camera: "Wide Shot",
    thumb: bgClassroom,
    assetIds: ["maya", "bg-classroom", "prop-desk", "voice-maya"],
  },
  {
    id: "sc-02",
    episodeId: "ep-03",
    number: 2,
    title: "Students gather",
    summary: "Students gather around the desk",
    duration: "05.0s",
    status: "ready",
    camera: "Medium Shot",
    thumb: sceneClassroom,
    assetIds: ["rahul", "alex", "bg-classroom", "prop-desk"],
  },
  {
    id: "sc-03",
    episodeId: "ep-03",
    number: 3,
    title: "The Broken Device",
    summary: "Maya notices the broken device",
    duration: "08.4s",
    status: "ready",
    camera: "Medium Shot",
    thumb: sceneClassroom,
    assetIds: ["maya", "rahul", "alex", "bg-classroom", "prop-device", "prop-desk", "voice-maya"],
  },
  {
    id: "sc-04",
    episodeId: "ep-03",
    number: 4,
    title: "Device close-up",
    summary: "Close-up of the device",
    duration: "03.6s",
    status: "review",
    camera: "Close Up",
    thumb: propDevice,
    assetIds: ["prop-device", "bg-classroom"],
  },
  {
    id: "sc-05",
    episodeId: "ep-03",
    number: 5,
    title: "Maya explains",
    summary: "Maya explains the problem",
    duration: "09.1s",
    status: "draft",
    camera: "Medium Shot",
    thumb: bgClassroom,
    assetIds: ["maya", "bg-classroom", "voice-maya"],
  },
  {
    id: "sc-06",
    episodeId: "ep-03",
    number: 6,
    title: "Investigation",
    summary: "Students investigate",
    duration: "07.8s",
    status: "draft",
    camera: "Two Shot",
    thumb: bgLab,
    assetIds: ["rahul", "alex", "bg-lab", "prop-laptop"],
  },
  {
    id: "sc-07",
    episodeId: "ep-03",
    number: 7,
    title: "The signal returns",
    summary: "The signal returns",
    duration: "05.5s",
    status: "draft",
    camera: "Close Up",
    thumb: coverSignal,
    assetIds: ["prop-device", "bg-classroom"],
  },
];

export const statusLabel: Record<SceneStatus, string> = {
  draft: "Draft",
  generating: "Generating",
  ready: "Ready",
  review: "Needs Review",
  failed: "Failed",
};

export const promptSuggestions = [
  "Change camera",
  "Move character",
  "Add an object",
  "Change lighting",
  "Change dialogue",
];

export const visualStyles = [
  "2D Cartoon",
  "3D Stylized",
  "Anime",
  "Storybook",
  "Cinematic",
  "Custom",
];

export const aspectRatios = ["YouTube 16:9", "Shorts 9:16", "Square 1:1"];
