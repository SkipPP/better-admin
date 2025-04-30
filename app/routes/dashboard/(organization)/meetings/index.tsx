import { createFileRoute } from "@tanstack/react-router";

import { Calendar } from "~/components/meetings/calendar";
import { EventCalendar } from "~/components/event-calendar";
import AddMeetingDialog from "~/components/meetings/AddMetting";

import { Meeting } from "~/server/types";
import { listOrganizationMeetings } from "~/server/meeting";

export const Route = createFileRoute("/dashboard/(organization)/meetings/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { meetings } = await listOrganizationMeetings();

    return { meetings, members: context.user?.activeOrganization?.members };
  },
});

function RouteComponent() {
  const { meetings, members } = Route.useLoaderData();

  const handleEventAdd = (event: Meeting) => {
    console.log(event);
  };

  const handleEventUpdate = (event: Meeting) => {
    console.log(event);
  };

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Meetings</h1>

          <div className="text-muted-foreground text-sm">
            Liste des meetings avec actions disponibles.
          </div>
        </div>

        <AddMeetingDialog members={members} />
      </div>

      <EventCalendar
        events={meetings}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={console.log}
      />
    </div>
  );
}
