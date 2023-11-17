'use client';
import { useSafeContext } from '../context/safe-context';

export function RegisterFlow() {
  const { register } = useSafeContext();

  return (
    <div>
      <button onClick={() => register()}>asd</button>
    </div>
  );
}
