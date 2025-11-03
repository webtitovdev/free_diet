import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 6,
    fontSize: 14,
  },
  components: {
    Button: {
      controlHeight: 40,
    },
    Input: {
      controlHeight: 40,
    },
  },
};
