import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StubPageProps = {
  title: string;
  description: string;
  action: string;
};

/** 占位页：页头（标题 + 描述 + 主操作）+ 空状态卡片（阶段 8/9 实现） */
export function StubPage({ title, description, action }: StubPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90">
          <Plus />
          {action}
        </Button>
      </div>
      <Card>
        <CardContent className="flex h-48 items-center justify-center text-sm text-slate-400">
          此模块将在阶段 8/9 实现
        </CardContent>
      </Card>
    </div>
  );
}
