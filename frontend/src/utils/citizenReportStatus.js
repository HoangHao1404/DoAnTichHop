const CITIZEN_STATUS_META = {
  "Đang Chờ": {
    label: "Đang Chờ",
    className: "bg-gray-100 text-gray-700",
    iconKey: "waiting",
  },
  "Đang Xử Lý": {
    label: "Đang Xử Lý",
    className: "bg-amber-100 text-amber-700",
    iconKey: "processing",
  },
  "Đã Hoàn Tất": {
    label: "Đã Hoàn Tất",
    className: "bg-emerald-100 text-emerald-700",
    iconKey: "completed",
  },
};

function normalizeStatusValue(status) {
  return String(status || "").trim();
}

export function getCitizenDisplayStatus(status) {
  const normalizedStatus = normalizeStatusValue(status);

  if (normalizedStatus === "Đã Hoàn Tất") {
    return "Đã Hoàn Tất";
  }

  if (normalizedStatus === "Đã Giải Quyết") {
    return "Đang Xử Lý";
  }

  if (normalizedStatus === "Đang Chờ" || normalizedStatus === "Đang Xử Lý") {
    return normalizedStatus;
  }

  return normalizedStatus || "Đang Chờ";
}

export function getCitizenStatusMeta(status) {
  const displayStatus = getCitizenDisplayStatus(status);
  return {
    label: displayStatus,
    ...(CITIZEN_STATUS_META[displayStatus] || {
      className: "bg-gray-100 text-gray-700",
      iconKey: "waiting",
    }),
  };
}

export const CITIZEN_STATUS_FILTER_OPTIONS = [
  "Đang Chờ",
  "Đang Xử Lý",
  "Đã Hoàn Tất",
];
