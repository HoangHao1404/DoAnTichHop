import { useEffect, useState } from "react";
import {
  Camera,
  CircleDot,
  Clock3,
  Hash,
  MapPin,
  RefreshCcw,
  Send,
  Users,
  X,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

function normalizeTypeKey(type) {
  return String(type || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function getTypeBadgeClass(type) {
  const normalizedType = normalizeTypeKey(type);

  if (normalizedType === "giao thong") {
    return "bg-[#F97316] text-white hover:bg-[#F97316]";
  }

  if (normalizedType === "dien") {
    return "bg-[#FDCA00] text-white hover:bg-[#FDCA00]";
  }

  if (normalizedType === "cay xanh") {
    return "bg-[#74C365] text-white hover:bg-[#74C365]";
  }

  if (normalizedType === "ctcc" || normalizedType === "cong trinh cong cong") {
    return "bg-[#B78FF2] text-white hover:bg-[#B78FF2]";
  }

  return "bg-orange-500 text-white hover:bg-orange-500";
}

function resolveImage(data, index) {
  const imageCandidate =
    data && Array.isArray(data.images) ? data.images[index] : "";

  if (typeof imageCandidate === "string") {
    const normalizedCandidate = imageCandidate.trim().toLowerCase();
    if (
      normalizedCandidate &&
      normalizedCandidate !== "null" &&
      normalizedCandidate !== "undefined"
    ) {
      return imageCandidate;
    }
  } else if (imageCandidate) {
    return imageCandidate;
  }

  if (data && index === 0 && data.image) {
    if (typeof data.image === "string") {
      const normalizedSingleImage = data.image.trim().toLowerCase();
      if (
        normalizedSingleImage &&
        normalizedSingleImage !== "null" &&
        normalizedSingleImage !== "undefined"
      ) {
        return data.image;
      }
    } else {
      return data.image;
    }
  }

  return "";
}

function getStatusValueClass(status) {
  const normalizedStatus = normalizeTypeKey(status);

  if (normalizedStatus === "dang cho") {
    return "text-[#3B3B3B]";
  }

  if (normalizedStatus === "dang xu ly") {
    return "text-[#FDCA00]";
  }

  if (normalizedStatus === "da giai quyet" || normalizedStatus === "da xu ly") {
    return "text-[#74C200]";
  }

  return "text-zinc-800";
}

function getIconToneClass(tone = "blue") {
  if (tone === "status-waiting") {
    return "bg-[#E9EBEC] text-[#3B3B3B]";
  }

  if (tone === "status-processing") {
    return "bg-[#FDCA00] text-[#FFF242]";
  }

  if (tone === "status-resolved") {
    return "bg-[#74C200] text-[#B0FF3B]";
  }

  return "bg-[#DCEEFF] text-[#3B82F6]";
}

function getStatusIconTone(status) {
  const normalizedStatus = normalizeTypeKey(status);

  if (normalizedStatus === "dang cho") {
    return "status-waiting";
  }

  if (normalizedStatus === "dang xu ly") {
    return "status-processing";
  }

  if (normalizedStatus === "da giai quyet" || normalizedStatus === "da xu ly") {
    return "status-resolved";
  }

  return "status-waiting";
}

function InfoBlock({
  icon: Icon,
  label,
  value,
  valueClassName = "",
  iconTone = "blue",
  className = "",
}) {
  const normalizedValue = value || "Chưa có dữ liệu";

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div
        className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getIconToneClass(iconTone)}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
          {label}
        </p>
        <p
          className={`mt-0.5 text-[15px] font-semibold leading-tight text-zinc-900 ${valueClassName}`}
        >
          {normalizedValue}
        </p>
      </div>
    </div>
  );
}

export default function ReportDetailQLKV({
  data,
  close,
  onUpdateStatus,
  onSendProcess,
}) {
  const isOpen = Boolean(data);

  if (!isOpen) return null;

  const beforeImage = resolveImage(data, 0);
  const afterImage = resolveImage(data, 1);
  const [afterImageFailed, setAfterImageFailed] = useState(false);

  useEffect(() => {
    setAfterImageFailed(false);
  }, [afterImage]);

  const showAfterImage = Boolean(afterImage) && !afterImageFailed;
  const statusValueClass = getStatusValueClass(data.status);
  const statusIconTone = getStatusIconTone(data.status);
  const issueTitle = data.issueTitle || data.title || "Chưa có tiêu đề";
  const teamName = data.team || data.handlerTeam || "Chưa phân công";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close?.()}>
      <DialogContent
        showCloseButton={false}
        className="z-[70] w-[min(90vw,760px)] max-w-none overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-[#f3f4f6] p-0 shadow-2xl"
      >
        <DialogHeader className="px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-[38px] font-semibold leading-tight text-zinc-900 sm:text-[32px]">
              Chi tiết báo cáo
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full bg-[#ebebeb] text-zinc-500 hover:bg-zinc-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[min(80vh,860px)] px-5 pb-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <Badge
              className={`w-fit rounded-full px-5 py-1.5 text-sm font-semibold leading-none ${getTypeBadgeClass(data.type)}`}
            >
              {data.type || "Khác"}
            </Badge>

            <h3 className="text-xl font-semibold leading-tight text-[#3D3D3D] sm:text-[32px]">
              {issueTitle}
            </h3>

            <div className="rounded-[10px] bg-[#e7e7ea] px-4 py-3">
              <p className="text-base italic text-zinc-600">
                {data.description || "Chưa có mô tả cho báo cáo này."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <InfoBlock
                icon={Hash}
                label="Mã báo cáo"
                value={data.id}
                valueClassName="text-[#2563EB]"
              />
              <InfoBlock icon={MapPin} label="Vị trí" value={data.location} />
              <InfoBlock icon={Clock3} label="Thời gian" value={data.time} />
              <InfoBlock
                icon={CircleDot}
                label="Trạng thái"
                value={data.status || "Đang chờ"}
                valueClassName={statusValueClass}
                iconTone={statusIconTone}
              />
              <InfoBlock
                icon={Users}
                label="Đội phụ trách"
                value={teamName}
                className="sm:col-span-2"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="gap-0 rounded-[12px] border-0 bg-[#ececef] py-0 shadow-none">
                <CardHeader className="px-4 pb-2 pt-4">
                  <CardTitle className="flex items-center text-[15px] font-semibold text-zinc-900">
                    <Camera className="mr-2 h-4 w-4 text-[#2563EB]" />
                    Ảnh Sự Cố
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="mx-auto h-[190px] w-full overflow-hidden rounded-[10px] bg-[#dcdcdf]">
                    {beforeImage ? (
                      <img
                        src={beforeImage}
                        alt="Anh hien trang"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 rounded-[12px] border-0 bg-[#ececef] py-0 shadow-none">
                <CardHeader className="px-4 pb-2 pt-4">
                  <CardTitle className="flex items-center text-[15px] font-semibold text-[#2563EB]">
                    <Camera className="mr-2 h-4 w-4 text-[#2563EB]" />
                    Ảnh Sau Khắc Phục
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="mx-auto h-[190px] w-full overflow-hidden rounded-[10px] bg-[#dcdcdf]">
                    {showAfterImage ? (
                      <img
                        src={afterImage}
                        alt="Anh sau khac phuc"
                        className="h-full w-full object-cover"
                        onError={() => setAfterImageFailed(true)}
                      />
                    ) : (
                      <Skeleton className="h-full w-full rounded-[10px] bg-zinc-300/70" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="items-center justify-end gap-3 px-5 pb-5 pt-3 sm:flex-row sm:px-6">
          <Button
            variant="outline"
            className="h-11 w-full rounded-[10px] border-[#b8bcc5] bg-[#f7f7f8] px-5 text-base font-semibold text-[#2f64da] hover:bg-[#eceef2] sm:w-auto"
            onClick={() => onUpdateStatus?.(data)}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Cập nhật trạng thái
          </Button>
          <Button
            className="h-11 w-full rounded-[10px] bg-[#2f64da] px-7 text-base font-semibold text-white hover:bg-[#2555c7] sm:w-auto"
            onClick={() => onSendProcess?.(data)}
          >
            Gửi xử lý
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
