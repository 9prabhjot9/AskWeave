import Link from "next/link"

interface TagBadgeProps {
  name: string
  count?: number
}

export function TagBadge({ name, count }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${name}`}
      className="inline-flex items-center px-3 py-1 rounded-md bg-muted hover:bg-muted/80 text-sm"
    >
      {name}
      {count !== undefined && <span className="ml-1.5 text-xs text-muted-foreground">×{count}</span>}
    </Link>
  )
}
