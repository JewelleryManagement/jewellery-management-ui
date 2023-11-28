import { useDisplay } from "vuetify/lib/framework";

export function isSmallScreen() {
  const display = useDisplay();
  return display.smAndDown.value;
}