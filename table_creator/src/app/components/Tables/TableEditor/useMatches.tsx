import { useState, useRef, useCallback, useEffect } from "react";
import { MatchItem } from "./types";

export const useMatches = (initialData: Omit<MatchItem, "itemEl" | "pathEl">[]) => {
  const [refsChanged, setRefsChanged] = useState(false);
  const [matches, setMatches] = useState<MatchItem[]>(() =>
    initialData.map((item) => ({ ...item, itemEl: null, pathEl: null })),
  );

  const refs = useRef<Record<string, HTMLElement | null>>({});

  const handleMatchItemRef = useCallback(
    (fieldName: string, el: HTMLElement | null) => {
      if (el && refs.current["item_" + fieldName] !== el) {
        refs.current["item_" + fieldName] = el;
        setRefsChanged((prev) => !prev); // Trigger only if there's an actual change
      }
    },
    [],
  );

  const handleMatchPathRef = useCallback(
    (fieldName: string, path: string, el: HTMLElement | null) => {
      if (el && refs.current[path] !== el) {
        refs.current[path] = el;
        setRefsChanged((prev) => !prev); // Trigger only if there's an actual change
      }
    },
    [],
  );

  useEffect(() => {
    // Synchronize matches with initialData to avoid index mismatches
    const newMatches = initialData.map((item) => ({
      ...item,
      itemEl: refs.current["item_" + item.itemField] || null,
      pathEl: refs.current[item.path] || null,
    }));

    const hasChanges = newMatches.some((newMatch, index) => {
      const oldMatch = matches[index];
      // Check if `oldMatch` exists and compare fields only if both items are defined
      return (
        oldMatch &&
        (oldMatch.itemField !== newMatch.itemField ||
          oldMatch.path !== newMatch.path ||
          oldMatch.itemEl !== newMatch.itemEl ||
          oldMatch.pathEl !== newMatch.pathEl)
      );
    });

    // Only update `matches` if changes were detected and all paths are set
    if (hasChanges && newMatches.every((match) => match.itemEl && match.pathEl)) {
      setMatches(newMatches);
    }
  }, [initialData, refsChanged]);

  return { matches, handleMatchItemRef, handleMatchPathRef };
};


/*import { useState, useRef, useCallback, useEffect } from "react";
import { MatchItem } from "./types";

export const useMatches = (initialData: Omit<MatchItem, "itemEl" | "pathEl">[]) => {
    const [refsChanged, setRefsChanged] = useState(false);
    const [matches, setMatches] = useState<MatchItem[]>(() =>
      initialData.map((item) => ({ ...item, itemEl: null, pathEl: null })),
    );
  
    const refs = useRef<Record<string, HTMLElement | null>>({});
  
    const handleMatchItemRef = useCallback(
      (fieldName: string, el: HTMLElement | null) => {
        if (el && refs.current["item_" + fieldName] !== el) {
          refs.current["item_" + fieldName] = el;
          setRefsChanged((prev) => !prev); // Trigger only if there's an actual change
        }
      },
      [],
    );
  
    const handleMatchPathRef = useCallback(
      (fieldName: string, path: string, el: HTMLElement | null) => {
        if (el && refs.current[path] !== el) {
          refs.current[path] = el;
          setRefsChanged((prev) => !prev); // Trigger only if there's an actual change
        }
      },
      [],
    );
  
    useEffect(() => {
      const newMatches = initialData.map((item) => ({
        ...item,
        itemEl: refs.current["item_" + item.itemField] || null,
        pathEl: refs.current[item.path] || null,
      }));
  
      const hasChanges = newMatches.some((newMatch, index) => {
        const oldMatch = matches[index];
        return (
          oldMatch.itemField !== newMatch.itemField ||
          oldMatch.path !== newMatch.path ||
          oldMatch.itemEl !== newMatch.itemEl ||
          oldMatch.pathEl !== newMatch.pathEl
        );
      });
  
      // Only update `matches` if changes were detected
      if (
        hasChanges &&
        newMatches.some((match) => match.itemEl && match.pathEl)
      ) {
        setMatches(newMatches);
      }
    }, [initialData, refsChanged]);
  
    return { matches, handleMatchItemRef, handleMatchPathRef };
  };
  */