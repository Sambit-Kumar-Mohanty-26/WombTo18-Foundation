import { useEffect } from "react";

const ALLOWED_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "[data-allow-copy='true']",
].join(", ");

function isAllowedTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest(ALLOWED_SELECTOR));
}

export function useContentProtection() {
  useEffect(() => {
    // Disable protection features in development mode
    if ((import.meta as any).env.DEV) {
      return;
    }

    document.body.classList.add("content-protection-enabled");

    const preventIfProtected = (event: Event) => {
      if (!isAllowedTarget(event.target)) {
        event.preventDefault();
      }
    };

    const preventShortcutCopy = (event: KeyboardEvent) => {
      if (isAllowedTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();
      const hasModifier = event.ctrlKey || event.metaKey;

      if (hasModifier && ["a", "c", "x", "s", "u", "p"].includes(key)) {
        event.preventDefault();
      }
    };

    document.addEventListener("copy", preventIfProtected);
    document.addEventListener("cut", preventIfProtected);
    document.addEventListener("contextmenu", preventIfProtected);
    document.addEventListener("dragstart", preventIfProtected);
    document.addEventListener("selectstart", preventIfProtected);
    document.addEventListener("keydown", preventShortcutCopy);

    return () => {
      document.body.classList.remove("content-protection-enabled");
      document.removeEventListener("copy", preventIfProtected);
      document.removeEventListener("cut", preventIfProtected);
      document.removeEventListener("contextmenu", preventIfProtected);
      document.removeEventListener("dragstart", preventIfProtected);
      document.removeEventListener("selectstart", preventIfProtected);
      document.removeEventListener("keydown", preventShortcutCopy);
    };
  }, []);
}
