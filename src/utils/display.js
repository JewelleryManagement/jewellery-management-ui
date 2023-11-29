import { useDisplay } from "vuetify/lib/framework";

export function isSmallScreen() {
  const display = useDisplay();
  return display.smAndDown.value;
}

export function isMediumScreen() {
  const display = useDisplay();
  return display.md.value;
}

export function isMediumAndDownScreen() {
  const display = useDisplay();
  return display.mdAndDown.value;
}