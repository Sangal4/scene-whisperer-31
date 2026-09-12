import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  assets as seedAssets,
  episodes as seedEpisodes,
  projects as seedProjects,
  scenes as seedScenes,
  images,
  type Episode,
  type Project,
  type Scene,
  type SceneStatus,
} from "./studio-data";

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  steps?: AgentStep[];
  preview?: string;
  actions?: boolean;
};

export type AgentStep = { label: string; state: "done" | "active" | "pending" };

export type ActivityItem = { time: string; text: string };

export type GenPhase = "idle" | "generating" | "ready" | "review" | "failed";

export type SceneRuntime = {
  messages: ChatMessage[];
  steps: AgentStep[];
  phase: GenPhase;
  progress: number;
  stageLabel: string;
  activity: ActivityItem[];
};

const clock = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultRuntime = (): SceneRuntime => ({
  messages: [
    {
      id: uid(),
      role: "user",
      text: "Make Maya walk toward the desk, look at the device, and pick it up.",
    },
    {
      id: uid(),
      role: "agent",
      text: "I'll update the scene using Maya, the Classroom background, and the Broken Device.",
      steps: [
        { label: "Identified Maya", state: "done" },
        { label: "Identified Classroom background", state: "done" },
        { label: "Identified Broken Device", state: "done" },
        { label: "Positioned Maya", state: "done" },
        { label: "Added walking animation", state: "done" },
        { label: "Updated camera", state: "done" },
        { label: "Rendered preview", state: "done" },
      ],
      preview: images.sceneClassroom,
      actions: true,
    },
    {
      id: uid(),
      role: "agent",
      text: "Maya now walks to the desk, picks up the device, and looks at it. I kept the medium camera shot.",
    },
  ],
  steps: [],
  phase: "ready",
  progress: 100,
  stageLabel: "Scene ready",
  activity: [
    { time: "12:41", text: "Scene opened" },
    { time: "12:42", text: "Loaded Classroom environment" },
    { time: "12:42", text: "Added Maya" },
    { time: "12:43", text: "Added Broken Device" },
    { time: "12:43", text: "Configured camera" },
    { time: "12:44", text: "Generated animation" },
    { time: "12:44", text: "Rendered preview" },
  ],
});

type StudioContextValue = {
  user: { name: string; email: string; initials: string };
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  projects: Project[];
  episodes: Episode[];
  scenes: Scene[];
  addProject: (p: Omit<Project, "id" | "episodes" | "edited" | "status" | "cover">) => Project;
  addEpisode: (projectId: string, title: string) => Episode;
  addScene: (episodeId: string, input: { title: string; summary: string; assetIds: string[] }) => Scene;
  updateScene: (id: string, patch: Partial<Scene>) => void;
  toggleSceneAsset: (sceneId: string, assetId: string) => void;
  removeSceneAsset: (sceneId: string, assetId: string) => void;
  runtimeFor: (sceneId: string) => SceneRuntime;
  sendInstruction: (sceneId: string, text: string) => void;
  regenerate: (sceneId: string) => void;
  setPhase: (sceneId: string, phase: GenPhase) => void;
};

const StudioContext = createContext<StudioContextValue | null>(null);

const STAGES = [
  "Planning the scene",
  "Loading assets",
  "Blocking animation",
  "Setting the camera",
  "Rendering preview",
];

export function StudioProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [episodes, setEpisodes] = useState<Episode[]>(seedEpisodes);
  const [scenes, setScenes] = useState<Scene[]>(seedScenes);
  const [runtimes, setRuntimes] = useState<Record<string, SceneRuntime>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const patchRuntime = useCallback((sceneId: string, patch: Partial<SceneRuntime>) => {
    setRuntimes((prev) => {
      const base = prev[sceneId] ?? defaultRuntime();
      return { ...prev, [sceneId]: { ...base, ...patch } };
    });
  }, []);

  const pushActivity = useCallback((sceneId: string, text: string) => {
    setRuntimes((prev) => {
      const base = prev[sceneId] ?? defaultRuntime();
      return {
        ...prev,
        [sceneId]: { ...base, activity: [...base.activity, { time: clock(), text }] },
      };
    });
  }, []);

  const runtimeFor = useCallback(
    (sceneId: string) => runtimes[sceneId] ?? defaultRuntime(),
    [runtimes],
  );

  const simulate = useCallback(
    (sceneId: string, userText: string | null) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];

      const scene = scenes.find((s) => s.id === sceneId);
      const named = userText ?? scene?.summary ?? "the scene";
      const steps: AgentStep[] = [
        { label: "Understood your direction", state: "active" },
        { label: "Matched assets from your library", state: "pending" },
        { label: "Positioned characters", state: "pending" },
        { label: "Applied animation", state: "pending" },
        { label: "Updating camera", state: "pending" },
        { label: "Rendering preview", state: "pending" },
      ];

      setRuntimes((prev) => {
        const base = prev[sceneId] ?? defaultRuntime();
        const messages: ChatMessage[] = [...base.messages];
        if (userText) messages.push({ id: uid(), role: "user", text: userText });
        messages.push({
          id: uid(),
          role: "agent",
          text: `On it — reading "${named}" and building it with your library assets.`,
          steps,
        });
        return {
          ...prev,
          [sceneId]: {
            ...base,
            messages,
            steps,
            phase: "generating",
            progress: 6,
            stageLabel: STAGES[0] ?? "Planning the scene",
            activity: [...base.activity, { time: clock(), text: "Received new direction" }],
          },
        };
      });

      setScenes((prev) =>
        prev.map((s) => (s.id === sceneId ? { ...s, status: "generating" as SceneStatus } : s)),
      );

      steps.forEach((_, i) => {
        const t = setTimeout(
          () => {
            const next = steps.map((s, idx) => ({
              ...s,
              state: (idx < i + 1 ? "done" : idx === i + 1 ? "active" : "pending") as AgentStep["state"],
            }));
            setRuntimes((prev) => {
              const base = prev[sceneId] ?? defaultRuntime();
              return {
                ...prev,
                [sceneId]: {
                  ...base,
                  steps: next,
                  progress: Math.round(((i + 1) / steps.length) * 100),
                  stageLabel: STAGES[Math.min(i, STAGES.length - 1)] ?? "Rendering preview",
                  messages: base.messages.map((m) => (m.steps ? { ...m, steps: next } : m)),
                  activity: [
                    ...base.activity,
                    { time: clock(), text: steps[i]?.label ?? "Working" },
                  ],
                },
              };
            });
          },
          700 * (i + 1),
        );
        timers.current.push(t);
      });

      const done = setTimeout(
        () => {
          setRuntimes((prev) => {
            const base = prev[sceneId] ?? defaultRuntime();
            return {
              ...prev,
              [sceneId]: {
                ...base,
                phase: "ready",
                progress: 100,
                stageLabel: "Scene ready",
                messages: [
                  ...base.messages.map((m) =>
                    m.steps
                      ? { ...m, preview: images.sceneClassroom, actions: true }
                      : m,
                  ),
                  {
                    id: uid(),
                    role: "agent" as const,
                    text: "Preview is ready. Tell me what to change, or apply it to the scene.",
                  },
                ],
                activity: [...base.activity, { time: clock(), text: "Preview render complete" }],
              },
            };
          });
          setScenes((prev) =>
            prev.map((s) => (s.id === sceneId ? { ...s, status: "ready" as SceneStatus } : s)),
          );
        },
        700 * (steps.length + 1),
      );
      timers.current.push(done);
    },
    [scenes],
  );

  const value = useMemo<StudioContextValue>(
    () => ({
      user: { name: "Jatin", email: "jatin@studio.app", initials: "JM" },
      signedIn,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
      projects,
      episodes,
      scenes,
      addProject: (p) => {
        const project: Project = {
          ...p,
          id: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${uid().slice(0, 4)}`,
          episodes: 0,
          edited: "Just now",
          status: "Draft",
          cover: images.coverSignal,
        };
        setProjects((prev) => [project, ...prev]);
        return project;
      },
      addEpisode: (projectId, title) => {
        const count = episodes.filter((e) => e.projectId === projectId).length;
        const ep: Episode = {
          id: `ep-${uid().slice(0, 5)}`,
          projectId,
          number: count + 1,
          title: title || "Untitled Episode",
          status: "draft",
          duration: "—",
          edited: "Just now",
          thumb: images.bgClassroom,
        };
        setEpisodes((prev) => [...prev, ep]);
        return ep;
      },
      addScene: (episodeId, input) => {
        const count = scenes.filter((s) => s.episodeId === episodeId).length;
        const scene: Scene = {
          id: `sc-${uid().slice(0, 5)}`,
          episodeId,
          number: count + 1,
          title: input.title || "Untitled Scene",
          summary: input.summary,
          duration: "—",
          status: "generating",
          camera: "Medium Shot",
          thumb: images.bgClassroom,
          assetIds: input.assetIds,
        };
        setScenes((prev) => [...prev, scene]);
        setRuntimes((prev) => ({
          ...prev,
          [scene.id]: {
            messages: [{ id: uid(), role: "user", text: input.summary }],
            steps: [],
            phase: "idle",
            progress: 0,
            stageLabel: "Ready to create",
            activity: [{ time: clock(), text: "Scene created" }],
          },
        }));
        setTimeout(() => simulate(scene.id, null), 400);
        return scene;
      },
      updateScene: (id, patch) =>
        setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
      toggleSceneAsset: (sceneId, assetId) => {
        setScenes((prev) =>
          prev.map((s) =>
            s.id === sceneId
              ? {
                  ...s,
                  assetIds: s.assetIds.includes(assetId)
                    ? s.assetIds.filter((a) => a !== assetId)
                    : [...s.assetIds, assetId],
                }
              : s,
          ),
        );
        const name = seedAssets.find((a) => a.id === assetId)?.name ?? "Asset";
        pushActivity(sceneId, `Attached ${name}`);
      },
      removeSceneAsset: (sceneId, assetId) => {
        setScenes((prev) =>
          prev.map((s) =>
            s.id === sceneId ? { ...s, assetIds: s.assetIds.filter((a) => a !== assetId) } : s,
          ),
        );
        const name = seedAssets.find((a) => a.id === assetId)?.name ?? "Asset";
        pushActivity(sceneId, `Removed ${name}`);
      },
      runtimeFor,
      sendInstruction: (sceneId, text) => simulate(sceneId, text),
      regenerate: (sceneId) => simulate(sceneId, null),
      setPhase: (sceneId, phase) => patchRuntime(sceneId, { phase }),
    }),
    [signedIn, projects, episodes, scenes, runtimeFor, simulate, patchRuntime, pushActivity],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside StudioProvider");
  return ctx;
}
