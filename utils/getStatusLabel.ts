import { BookProps } from "@/type";

export function getStatusLabel(status: BookProps["status"]) {
  switch (status) {
    case "reading":
      return "در حال خواندن";
    case "completed":
      return "خوانده شده";
    case "unread":
    default:
      return "خوانده نشده";
  }
}
