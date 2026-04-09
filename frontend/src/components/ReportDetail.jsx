import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
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
import { Separator } from "./ui/separator";

function getTypeLabel(type) {
  if (!type) return "khac";
  return String(type);
}

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

function getStatusLabel(status) {
  if (!status) return "dang cho";
  return String(status);
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

export default function ReportDetail({ data, close }) {
  const isOpen = Boolean(data);

  if (!isOpen) return null;

  const beforeImage = resolveImage(data, 0);
  const afterImage = resolveImage(data, 1);
  const [afterImageFailed, setAfterImageFailed] = useState(false);

  useEffect(() => {
    setAfterImageFailed(false);
  }, [afterImage]);

  const showAfterImage = Boolean(afterImage) && !afterImageFailed;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close?.()}>
      <DialogContent
        showCloseButton={false}
        className="z-[60] w-[min(80vw,750px)] max-w-none overflow-hidden rounded-[18px] border border-[#d8e6ff] bg-white p-0 shadow-2xl"
      >
        <DialogHeader className="rounded-t-[18px] bg-white px-4 pt-4 sm:px-5 sm:pt-5 md:px-6 md:pt-6">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="pr-2 text-lg font-semibold leading-snug text-zinc-900 sm:text-xl lg:text-2xl">
              {data.title || "Khong co tieu de"}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full bg-[#f5f5f5] text-zinc-600 hover:bg-[#ebebeb] sm:h-9 sm:w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge
              className={`h-8 rounded-full px-4 text-xs font-semibold sm:text-sm ${getTypeBadgeClass(data.type)}`}
            >
              {getTypeLabel(data.type)}
            </Badge>
            <Badge className="h-8 rounded-full bg-[#d5d5d5] px-4 text-xs font-semibold text-zinc-800 hover:bg-[#d5d5d5] sm:text-sm">
              {getStatusLabel(data.status)}
            </Badge>
          </div>
        </DialogHeader>

        <Separator className="mt-4 bg-[#dbe8ff]" />

        <ScrollArea className="max-h-[min(74vh,820px)] px-4 py-4 sm:px-5 md:px-6">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6">
              <div className="rounded-[12px] border border-[#dce9ff] bg-[#edf5ff] px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-xs font-medium uppercase text-[#A3A3A3] sm:text-sm">
                  Mã báo cáo
                </p>
                <p className="text-lg font-semibold leading-tight text-[#1E67D6]">
                  {data.id || "N/A"}
                </p>
              </div>

              <div className="rounded-[12px] border border-[#e6e6dc] bg-[#fff9ea] px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-xs font-medium uppercase text-[#A3A3A3] sm:text-sm">
                  Thời gian
                </p>
                <p className="text-sm font-semibold leading-tight text-zinc-900 sm:text-base">
                  {data.time || "Chua co thoi gian"}
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#e4ecfb] bg-[#f7faff] px-3 py-3 sm:px-4 sm:py-4">
              <p className="text-xs font-medium uppercase text-[#A3A3A3] sm:text-sm">
                Vị trí
              </p>
              <p
                className="text-sm font-semibold leading-tight text-zinc-900 sm:text-base"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {data.location || "Chua co vi tri"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase text-[#A3A3A3] sm:text-sm">
                Mô tả
              </p>
              <div className="rounded-[10px] border border-[#e4ecfb] bg-[#f5f9ff] px-3 py-3 sm:px-4 sm:py-4">
                <p
                  className="text-xs italic leading-snug text-zinc-700 sm:text-sm"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {data.description || "Chua co mo ta cho bao cao nay."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 2xl:grid-cols-2">
              <Card className="gap-0 rounded-[12px] border border-[#dce9ff] bg-[#f6faff] py-0 ring-0 shadow-sm">
                <CardHeader className="px-3 pb-1 pt-3 sm:px-4 sm:pb-2 sm:pt-4">
                  <CardTitle className="flex text-xs font-medium text-[#1E67D6] sm:text-sm">
                    <Camera className="mr-2 h-5 w-5 text-[#1E67D6]" />
                    Ảnh sự cố
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <div className="mx-auto h-[clamp(180px,24vh,250px)] w-full overflow-hidden rounded-[10px] bg-white">
                    {beforeImage ? (
                      <img
                        src={beforeImage}
                        alt="Anh su co"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-400 sm:text-sm">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 rounded-[12px] border border-[#dce9ff] bg-[#f6faff] py-0 ring-0 shadow-sm">
                <CardHeader className="px-3 pb-1 pt-3 sm:px-4 sm:pb-2 sm:pt-4">
                  <CardTitle className="flex text-xs font-medium text-[#1E67D6] sm:text-sm">
                    <Camera className="mr-2 h-5 w-5 text-[#1E67D6]" />
                    Ảnh sau khắc phục
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <div className="mx-auto h-[clamp(180px,24vh,250px)] w-full overflow-hidden rounded-[10px] bg-[#f2f2f2]">
                    {showAfterImage ? (
                      <img
                        src={afterImage}
                        alt="Anh sau khac phuc"
                        className="h-full w-full object-cover"
                        onError={() => setAfterImageFailed(true)}
                      />
                    ) : (
                      <Skeleton className="h-full w-full rounded-[10px] bg-zinc-200/60" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>

        <Separator className="bg-[#dbe8ff]" />

        <DialogFooter className="bg-white px-4 py-4 sm:px-5 md:px-6">
          <DialogClose asChild>
            <Button className="h-10 w-full rounded-[10px] bg-[#2562e9] text-sm font-semibold text-white hover:bg-[#1f56d1] sm:h-[42px] sm:w-[160px]">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
