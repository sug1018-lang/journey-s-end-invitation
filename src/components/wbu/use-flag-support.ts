import { useEffect, useState } from "react";

import { flagEmojiSupported } from "@/lib/countries";

/** True when the device can draw flag emoji (checked after hydration). */
export function useFlagSupport() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(flagEmojiSupported());
  }, []);
  return supported;
}
