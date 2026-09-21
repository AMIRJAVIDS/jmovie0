import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const mouse = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const cursor = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);

  useEffect(() => {
    // موبایل → Cursor سفارشی غیرفعال
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!visible) setVisible(true);

      const target = e.target.closest(
        `
        a,
        button,
        input,
        textarea,
        select,
        [role="button"],
        [data-cursor]
        `
      );

      setHover(Boolean(target));
    };

    const enter = () => setVisible(true);

    const leave = () => setVisible(false);

    const down = () => setClick(true);

    const up = () => setClick(false);

    window.addEventListener("mousemove", move, {
      passive: true,
    });

    window.addEventListener("mouseenter", enter);

    window.addEventListener("mouseleave", leave);

    window.addEventListener("mousedown", down);

    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);

      window.removeEventListener("mouseenter", enter);

      window.removeEventListener("mouseleave", leave);

      window.removeEventListener("mousedown", down);

      window.removeEventListener("mouseup", up);
    };
  }, [visible]);

  useEffect(() => {
    let raf;

    const animate = () => {
      cursor.current.x +=
        (mouse.current.x - cursor.current.x) * 0.18;

      cursor.current.y +=
        (mouse.current.y - cursor.current.y) * 0.18;

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(raf);
  }, []);

  const value = useMemo(
    () => ({
      mouse,
      cursor,
      visible,
      hover,
      click,
    }),
    [visible, hover, click]
  );

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);

  if (!context) {
    throw new Error(
      "useCursor must be used inside CursorProvider."
    );
  }

  return context;
}