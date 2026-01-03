import { TargetsProps } from "@/type";

export function getDateRange(period: TargetsProps["period"]) {
  const now = new Date();

  switch (period) {
    case "daily":
      return {
        from: new Date(now.setHours(0, 0, 0, 0)),
        to: new Date(),
      };

    case "weekly":
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return {
        from: startOfWeek,
        to: new Date(),
      };

    case "monthly":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        from: startOfMonth,
        to: new Date(),
      };
  }
}
