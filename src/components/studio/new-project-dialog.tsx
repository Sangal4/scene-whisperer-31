import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { aspectRatios, visualStyles } from "@/lib/studio-data";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

export function NewProjectDialog({ trigger }: { trigger: ReactNode }) {
  const { addProject } = useStudio();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("3D Stylized");
  const [ratio, setRatio] = useState("YouTube 16:9");

  const create = () => {
    const project = addProject({
      name: name.trim() || "Untitled Project",
      description: description.trim() || "A new animated series.",
      style,
      ratio,
    });
    setOpen(false);
    setName("");
    setDescription("");
    toast.success(`${project.name} created`);
    navigate({ to: "/projects/$projectId", params: { projectId: project.id } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Set the basics. You can change everything later in project settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Professor Maya"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-desc">Description</Label>
            <Textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="An educational animated YouTube series."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Visual style</Label>
            <div className="flex flex-wrap gap-2">
              {visualStyles.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    style === s
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-elevated text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Default aspect ratio</Label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRatio(r)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    ratio === r
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-elevated text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={create}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
