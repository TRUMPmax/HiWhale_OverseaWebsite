"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/api";

type ContactInfo = {
  email: string;
  phone: string;
  address: string;
  addressEn: string;
  whatsapp: string;
  linkedin: string;
};

const EMPTY: ContactInfo = {
  email: "",
  phone: "",
  address: "",
  addressEn: "",
  whatsapp: "",
  linkedin: "",
};

/** 内容管理 · 联系方式（contact-info） */
export function ContactInfoTab() {
  const [form, setForm] = useState<ContactInfo>(EMPTY);

  useEffect(() => {
    adminApi<{ value: Partial<ContactInfo> | null }>("/api/settings/contact-info")
      .then(({ value }) => value && setForm({ ...EMPTY, ...value }))
      .catch(() => {});
  }, []);

  const save = () => {
    adminApi("/api/settings/contact-info", { method: "PUT", body: { value: form } })
      .then(() => toast.success("保存成功"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  const fields: Array<{ key: keyof ContactInfo; label: string }> = [
    { key: "email", label: "邮箱" },
    { key: "phone", label: "电话" },
    { key: "address", label: "地址（中文）" },
    { key: "addressEn", label: "Address (EN)" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "linkedin", label: "LinkedIn" },
  ];

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-base">联系方式</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label>{field.label}</Label>
            <Input
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          </div>
        ))}
        <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={save}>
          <Save /> 保存
        </Button>
      </CardContent>
    </Card>
  );
}
