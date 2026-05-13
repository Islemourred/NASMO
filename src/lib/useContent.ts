import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type ContentMap = Record<string, string>;

export function useSiteContent(section: string): { content: ContentMap; loading: boolean } {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("key, value")
      .eq("section", section)
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          const map: ContentMap = {};
          data.forEach(d => { map[d.key] = d.value; });
          setContent(map);
        }
        setLoading(false);
      });
  }, [section]);

  return { content, loading };
}

export function useMultiSiteContent(sections: string[]): { content: Record<string, ContentMap>; loading: boolean } {
  const [content, setContent] = useState<Record<string, ContentMap>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("section, key, value")
      .in("section", sections)
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          const map: Record<string, ContentMap> = {};
          data.forEach(d => {
            if (!map[d.section]) map[d.section] = {};
            map[d.section][d.key] = d.value;
          });
          setContent(map);
        }
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.join(",")]);

  return { content, loading };
}
