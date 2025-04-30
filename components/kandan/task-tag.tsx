import { Badge } from "~/components/ui/badge";

import { TaskTag as TaskTagType } from "~/server/schema";

const colorClasses: Record<string, string> = {
  red: "bg-red-500/20 text-red-500",
  blue: "bg-blue-500/20 text-blue-500",
  green: "bg-green-500/20 text-green-500",
  yellow: "bg-yellow-500/20 text-yellow-500",
};

type TaskTagProps = {
  tag: TaskTagType;
};

export function TaskTag({ tag }: TaskTagProps) {
  const tagColorClasses = colorClasses[tag.color] || "bg-gray-500/20 text-gray-600";

  return (
    <Badge className={`font-normal ${tagColorClasses} rounded-sm`}>{tag?.label}</Badge>
  );
}
