import { useSpring } from "react-spring";

export const useFadeIn = () =>
  useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { duration: 200 },
  });
