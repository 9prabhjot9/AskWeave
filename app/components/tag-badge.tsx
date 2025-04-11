import Link from "next/link"

interface TagBadgeProps {
  tag: string
  clickable?: boolean
}

export function TagBadge({ tag, clickable = true }: TagBadgeProps) {
  const badge = (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
      {tag}
    </span>
  )

  if (clickable) {
    return (
      <Link href={`/tags/${tag}`} className="hover:opacity-80">
        {badge}
      </Link>
    )
  }

  return badge
} 