import { Check } from "@/lib/icons";
import { useStore } from "@/store/StoreContext";

export default function Toast() {
  const { toast } = useStore();
  return (
    <div className={`toast${toast ? " on" : ""}`} role="status" aria-live="polite">
      <Check /><span>{toast}</span>
    </div>
  );
}
