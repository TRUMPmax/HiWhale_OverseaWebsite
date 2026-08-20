import { create } from "zustand";
import { UserRole } from "@hiwhale/shared/constants";

export type AdminStaff = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "disabled";
};

type StaffState = {
  staff: AdminStaff[];
  addStaff: (item: AdminStaff) => void;
  updateStaff: (id: string, patch: Partial<AdminStaff>) => void;
  toggleStatus: (id: string) => void;
};

const seed: AdminStaff[] = [
  {
    id: "s-1",
    name: "系统管理员",
    email: "admin@hiwhale.com",
    role: UserRole.SUPER_ADMIN,
    status: "active",
  },
  {
    id: "s-2",
    name: "陈凯文",
    email: "kevin.chen@hiwhale.com",
    role: UserRole.SALES,
    status: "active",
  },
  {
    id: "s-3",
    name: "李晓梅",
    email: "xiaomei.li@hiwhale.com",
    role: UserRole.SALES,
    status: "active",
  },
  {
    id: "s-4",
    name: "王五",
    email: "wang.wu@hiwhale.com",
    role: UserRole.SALES,
    status: "disabled",
  },
  {
    id: "s-5",
    name: "Mia Zhang",
    email: "mia@hiwhale.com",
    role: UserRole.SALES,
    status: "active",
  },
  {
    id: "s-6",
    name: "赵工",
    email: "zhao@hiwhale.com",
    role: UserRole.PRODUCT_TECH,
    status: "active",
  },
  {
    id: "s-7",
    name: "钱芳",
    email: "qian.fang@hiwhale.com",
    role: UserRole.OPERATIONS,
    status: "active",
  },
];

/** 员工管理 Mock store（会话内 CRUD） */
export const useStaffStore = create<StaffState>()((set) => ({
  staff: seed,
  addStaff: (item) => set((s) => ({ staff: [item, ...s.staff] })),
  updateStaff: (id, patch) =>
    set((s) => ({ staff: s.staff.map((item) => (item.id === id ? { ...item, ...patch } : item)) })),
  toggleStatus: (id) =>
    set((s) => ({
      staff: s.staff.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "active" ? "disabled" : "active" }
          : item,
      ),
    })),
}));
