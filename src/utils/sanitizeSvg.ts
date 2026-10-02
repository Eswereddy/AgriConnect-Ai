// Sanitizes SVG markup (e.g. AI-generated graphics) before it is injected with
// dangerouslySetInnerHTML. Removes scripts, embedded HTML, event handlers and
// external/javascript links so a malicious or malformed SVG cannot run code.

const BLOCKED_TAGS = new Set([
  "script", "foreignobject", "iframe", "object", "embed", "link", "meta", "style", "audio", "video", "animate", "set"
]);

export function sanitizeSvg(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  try {
    const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
    if (doc.querySelector("parsererror")) return "";
    const root = doc.documentElement;
    if (!root || root.nodeName.toLowerCase() !== "svg") return "";

    const all = [root, ...Array.from(root.querySelectorAll("*"))];
    for (const el of all) {
      if (el !== root && BLOCKED_TAGS.has(el.nodeName.toLowerCase())) {
        el.parentNode?.removeChild(el);
        continue;
      }
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();
        const isHref = name === "href" || name === "xlink:href";
        if (
          name.startsWith("on") ||
          (isHref && !value.startsWith("#")) ||
          (name === "style" && (value.includes("url(") || value.includes("expression") || value.includes("javascript:")))
        ) {
          el.removeAttribute(attr.name);
        }
      }
    }
    return new XMLSerializer().serializeToString(root);
  } catch {
    return "";
  }
}
