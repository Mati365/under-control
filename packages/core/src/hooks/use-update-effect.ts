import {
  useRef,
  useEffect,
  type EffectCallback,
  type DependencyList,
} from 'react';

export const useUpdateEffect = (
  effect: EffectCallback,
  dependencies: DependencyList,
): void => {
  const isInitialMountRef = useRef(true);
  const isInitialMount = isInitialMountRef.current;

  isInitialMountRef.current = false;

  useEffect(() => {
    if (!isInitialMount) {
      effect();
    }
  }, dependencies);
};
