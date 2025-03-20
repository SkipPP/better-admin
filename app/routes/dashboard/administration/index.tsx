import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/administration/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/administration/"!</div>
}
