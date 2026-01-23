import { useSelector } from "react-redux";

export const useAnalyticsContext = () => {
  const user = useSelector((state: any) => state.auth?.user);
  const role = user?.role || "admin";
  const vendorId = role === "vendor" ? user?._id || user?.id || "" : "";

  return { role, vendorId };
};
