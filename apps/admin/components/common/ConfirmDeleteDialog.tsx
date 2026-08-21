import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 被删除对象名称，展示在确认文案中 */
  name: string;
  onConfirm: () => void;
};

/** 通用删除确认弹窗 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  name,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除？</DialogTitle>
          <DialogDescription>删除「{name}」后将无法恢复。</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
