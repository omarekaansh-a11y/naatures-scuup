/** Style reminder — Mall Road Monograph: quiet, precise metadata for each editorial route. */
import { useEffect } from "react";

type RouteMetaProps = { title: string; description: string; noIndex?: boolean };

function updateMeta(selector: string, attribute: "name" | "property", value: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function RouteMeta({ title, description, noIndex = false }: RouteMetaProps) {
  useEffect(() => {
    document.title = title;
    updateMeta('meta[name="description"]', "name", "description", description);
    updateMeta('meta[property="og:title"]', "property", "og:title", title);
    updateMeta('meta[property="og:description"]', "property", "og:description", description);
    updateMeta('meta[name="robots"]', "name", "robots", noIndex ? "noindex,follow" : "index,follow");
  }, [description, noIndex, title]);
  return null;
}
