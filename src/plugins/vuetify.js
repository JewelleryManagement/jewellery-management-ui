// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          "primary-green": "#66BB6A",
          "primary-blue": "#1565C0",
          teal: "#009688",
        },
      },
    },
  },
});
