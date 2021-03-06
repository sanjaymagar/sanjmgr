import React, { FC, useRef, useEffect, useState } from 'react';
// Usage
const Section: FC = ({ children }) => {
  const [ref, entry] = useIntersectionObserver({
    /* otpions */
  });
  console.log(`Render Section ${children?.toString()}`, entry);
  return (
    <div
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        border: '1px dashed #000',
      }}>
      <div style={{ margin: 'auto' }}>{children}</div>
    </div>
  );
};
export const Page = () => {
  return [1, 2, 3].map(number => (
    <Section key={number}>{`div n°${number}`}</Section>
  ));
};

// Hook

interface ExtendedEntry extends IntersectionObserverEntry {
  isVisible: boolean;
}
interface Args extends IntersectionObserverInit {
  onAppearOnly?: boolean;
}
type Return<T> = [(node: T) => void, ExtendedEntry?];
const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  root = null,
  rootMargin = '0%',
  onAppearOnly = false,
}: Args): Return<T> => {
  const [entry, setEntry] = useState<ExtendedEntry>();
  const [node, setNode] = useState<T>();
  const observer = useRef<IntersectionObserver | null>(null);
  const noUpdate = entry?.isVisible && onAppearOnly;
  useEffect(() => {
    if (!window?.IntersectionObserver || noUpdate) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const isVisible = entries[0].intersectionRatio > 0;
        setEntry({ ...entries[0], isVisible });
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );
    // Ensure the rest of useEffect use the same observer
    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);
    return () => {
      currentObserver.disconnect();
    };
  }, [node, threshold, root, rootMargin, noUpdate]);
  return [setNode, entry];
};
