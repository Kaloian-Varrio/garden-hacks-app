import type { DashboardHackFormValues, SelectOption } from "@/lib/dashboard/types";

export type GroupHackFormValues = Omit<DashboardHackFormValues, "groupId">;

export type GroupHackFormOptions = {
  categories: SelectOption[];
};

export type GroupHackActionState = {
  errors?: {
    title?: string;
    content?: string;
    categoryId?: string;
    form?: string;
  };
  values?: Partial<GroupHackFormValues>;
};
