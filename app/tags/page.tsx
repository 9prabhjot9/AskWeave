"use client";

import { useEffect, useState } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TagBadge } from "@/components/tag-badge"
import StorageService, { Collections } from "@/lib/storage";

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        // Initialize storage
        await StorageService.initStorage();
        
        // Fetch tags
        const fetchedTags = await StorageService.queryDocuments(Collections.TAGS);
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tags</h1>
          <Button asChild>
            <Link href="/questions/ask">Ask a Question</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No tags found</p>
            <Button asChild>
              <Link href="/questions/ask">Ask the first question to create tags</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <Link 
                key={tag.name || tag.id} 
                href={`/tags/${tag.name || tag.id}`}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-center">
                  <TagBadge name={tag.name} />
                  <span className="text-sm text-muted-foreground">{tag.count || 0} questions</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 