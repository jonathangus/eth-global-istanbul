'use client';
import { useSafeContext } from '../context/safe-context';

export function RegisterFlow() {
  const { register, createSafe, safeSelected, connectAgain } = useSafeContext();

  return (
    <div>
      <button onClick={() => register()}>login</button>

      {safeSelected && (
        <button onClick={() => createSafe()}>create safe</button>
      )}

      {connectAgain && (
        <div>
          <button onClick={() => connectAgain()}>dunno</button>
        </div>
      )}
    </div>
  );
}
